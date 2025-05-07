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
import dayjs from "dayjs";
import { getTrazabilidadTraslados } from "@/services/activos/trazabilidadTrasladosApi";

const { Text, Title } = Typography;

export const TrazabilidadTrasladosActivosModal = ({
  open,
  setOpen,
  id_trasladoActivo,
}: Props) => {
  const [trazabilidad, setTrazabilidad] = useState<TimelineItemProps[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);

  const traducirEstado = (estado: string): string => {
    switch (estado) {
      case "cerrado":
        return "cerrado";
      case "1":
        return "pendiente";
      case "3":
        return "pendiente";
      case "acetado":
        return "acetado";
      default:
        return "Desconocido";
    }
  };

  useEffect(() => {
    setLoader(true);
    if (id_trasladoActivo && open) {
      getTrazabilidadTraslados(id_trasladoActivo)
        .then(({ data: { data } }) => {
          setTrazabilidad(
            data.map((item: any) => {
              const fecha_recibido = dayjs(item.fecha).format("YYYY-MM-DD HH:mm:ss");

              const { id_trasladoActivo, estado, bodega_destino} = item;
              const colors = [
                "#ff5e5d",
                "#faad14",
                "#fa8c16",
                "#1677ff",
                "#13c2c2",
              ];

              return {
                dot: (
                  <ClockCircleOutlined
                    style={{ color: colors[Math.floor(Math.random() * 3)] }}
                  />
                ),
                children: (
                  <Space
                    direction="vertical"
                    style={{
                      backgroundColor: colors[Math.floor(Math.random() * 3)],
                      width: "100%",
                      borderRadius: 5,
                      color: "white",
                      padding: 5,
                    }}
                  >
                    <Text>
                      <b>bodega_destino:</b> {bodega_destino}
                    </Text>
                    <Text>
                      <b>usuario:</b> {id_trasladoActivo}
                    </Text>
                    <Text> 
                      <b>fecha_recibido:</b> {fecha_recibido}
                    </Text>
                    <Text>
                      <b>Estado:</b> {traducirEstado(estado)}
                    </Text>
                  </Space>
                ),
              };
            })
          );
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores: string[] = Object.values(errors);
              for (const error of errores) {
                notificationApi.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
              });
            }
          }
        )
        .finally(() => setLoader(false));
    }
  }, [id_trasladoActivo, open]);

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
        footer={[]}
        style={{ top: 5 }}
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Title level={4} style={{ textAlign: "center" }}>
              Trazabilidad
            </Title>
          </Col>
          <Col span={24}>
            {!loader ? (
              <Timeline items={trazabilidad} style={{ paddingInline: "10%" }} />
            ) : (
              <Skeleton active />
            )}
          </Col>
        </Row>
      </Modal>
    </>
  );
};
