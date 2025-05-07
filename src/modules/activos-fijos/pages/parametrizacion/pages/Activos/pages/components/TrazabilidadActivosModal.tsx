import { useEffect, useState } from "react";
import { Props } from "./types";
import {
  Col,
  Modal,
  notification,
  Row,
  Skeleton,
  Space,
  Timeline,
  TimelineItemProps,
  Typography,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { getTrazabilidad } from "@/services/activos/trazabilidadActivosAPI";
import dayjs from "dayjs";

const { Text, Title } = Typography;

export const TrazabilidadActivosModal = ({ open, setOpen, id_activo }: Props) => {
  const [trazabilidad, setTrazabilidad] = useState<TimelineItemProps[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);

  /**
   * Traduce los estados numéricos a nombres legibles.
   */
  const traducirEstado = (estado: string): string => {
    const estados: Record<string, string> = {
      "0": "Inactivo",
      "1": "Activo",
      "3": "Pendiente",
      "4": "Mantenimiento",
      "5": "Vencido",
      "6": "Aceptado Gerencia",
      "7": "Aceptado Admin",
    };
    return estados[estado] || "Desconocido";
  };

  /**
   * Obtiene los datos de trazabilidad desde la API.
   */
  const fetchTrazabilidad = async () => {
    if (!id_activo || !open) return;
    
    setLoader(true);
    try {
      const { data: { data } } = await getTrazabilidad(id_activo);

      const timelineItems = data.map((item: any) => {
        const fecha = dayjs(item.fecha).format("YYYY-MM-DD HH:mm:ss");
        const usuarioNombre = item.usuarios?.nombre ? item.usuarios.nombre : "N/A"; // Asegura que siempre haya un valor
        const { id_activo, estado, proceso } = item;

        const colors = ["#ff5e5d", "#faad14", "#fa8c16", "#1677ff", "#13c2c2"];
        const colorSeleccionado = colors[Math.floor(Math.random() * colors.length)];

        return {
          dot: <ClockCircleOutlined style={{ color: colorSeleccionado }} />, 
          children: (
            <Space
              direction="vertical"
              style={{
                backgroundColor: colorSeleccionado,
                width: "100%",
                borderRadius: 5,
                color: "white",
                padding: 5,
              }}
            >
              <Text><b>Fecha:</b> {fecha || "N/A"}</Text>
              <Text><b>Usuario:</b> {usuarioNombre}</Text>
              <Text><b>Activo:</b> {id_activo || "N/A"}</Text>
              <Text><b>Estado:</b> {traducirEstado(estado) || "N/A"}</Text>
              <Text><b>Proceso:</b> {proceso || "N/A"}</Text>
            </Space>
          ),
        };
      });

      setTrazabilidad(timelineItems);
    } catch (error: any) {
      console.error("Error al obtener trazabilidad:", error);
      const errores = error?.response?.data?.errors;

      if (errores) {
        Object.values(errores).forEach((err: any) => {
          notificationApi.error({ message: err });
        });
      } else {
        notificationApi.error({ message: error?.response?.data?.message || "Error desconocido" });
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchTrazabilidad();
  }, [id_activo, open]);

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        destroyOnClose
        onCancel={() => {
          setOpen(false);
          setTrazabilidad([]);
        }}
        footer={null}
        style={{ top: 5 }}
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Title level={4} style={{ textAlign: "center" }}>Trazabilidad</Title>
          </Col>
          <Col span={24}>
            {!loader ? (
              trazabilidad.length > 0 ? (
                <Timeline items={trazabilidad} style={{ paddingInline: "10%" }} />
              ) : (
                <Text style={{ textAlign: "center", display: "block", color: "#999" }}>
                  No hay registros de trazabilidad disponibles.
                </Text>
              )
            ) : (
              <Skeleton active />
            )}
          </Col>
        </Row>
      </Modal>
    </>
  );
};
