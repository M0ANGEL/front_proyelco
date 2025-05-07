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
import { getTrazabilidadDepreciacion } from "@/services/activos/trazabilidadDepreciacionAPI"; // Asegúrate de tener este servicio configurado
import dayjs from "dayjs";

const { Text, Title } = Typography;

export const TrazabilidadDepreciacionModal = ({
  open,
  setOpen,
  id_activo,
}: Props) => {
  const [trazabilidadDepreciacion, setTrazabilidadDepreciacion] = useState<TimelineItemProps[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    if (id_activo && open) {
      getTrazabilidadDepreciacion(id_activo)
        .then(({ data: { data } }) => {
          setTrazabilidadDepreciacion(
            data.map((item: any) => {
              const fecha = dayjs(item.fecha).format("YYYY-MM-DD HH:mm:ss");
              const { id_activo, valor_presente, vida_util_presente } = item;
              const colors = ["#ff5e5d", "#faad14", "#1677ff"];

              return {
                dot: (
                  <ClockCircleOutlined
                    style={{ color: colors[Math.floor(Math.random() * colors.length)] }}
                  />
                ),
                children: (
                  <Space
                    direction="vertical"
                    style={{
                      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                      width: "100%",
                      borderRadius: 5,
                      color: "white",
                      padding: 5,
                    }}
                  >
                    <Text>
                      <b>Fecha:</b> {fecha}
                    </Text>
                    <Text>
                      <b>Activo ID:</b> {id_activo}
                    </Text>
                    <Text>
                      <b>Valor presente:</b> {valor_presente}
                    </Text>
                    <Text>
                      <b>Vida útil presente:</b> {vida_util_presente} años
                    </Text>
                  </Space>
                ),
              };
            })
          );
        })
        .catch(({ response: { data } }) => {
          notificationApi.open({
            type: "error",
            message: data.message || "Error al cargar la trazabilidad de depreciación",
          });
        })
        .finally(() => setLoader(false));
    }
  }, [id_activo, open]);

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        destroyOnClose
        onCancel={() => {
          setOpen(false);
          setTrazabilidadDepreciacion([]);
        }}
        footer={null}
        style={{ top: 5 }}
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Title level={4} style={{ textAlign: "center" }}>
              Trazabilidad de Depreciación
            </Title>
          </Col>
          <Col span={24}>
            {!loader ? (
              <Timeline items={trazabilidadDepreciacion} style={{ paddingInline: "10%" }} />
            ) : (
              <Skeleton active />
            )}
          </Col>
        </Row>
      </Modal>
    </>
  );
};
