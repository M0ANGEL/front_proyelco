/* eslint-disable react-hooks/exhaustive-deps */
import { getTrazabilidad } from "@/services/radicacion/glosasAPI";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Props } from "./types";
import dayjs from "dayjs";
import {
  Modal,
  Space,
  Timeline,
  TimelineItemProps,
  notification,
  Typography,
  Row,
  Col,
  Skeleton,
} from "antd";

const { Text, Title } = Typography;

export const ModalTrazabilidad = ({ open, setOpen, id_factura }: Props) => {
  const [trazabilidad, setTrazabilidad] = useState<TimelineItemProps[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    if (id_factura && open) {
      getTrazabilidad(id_factura)
        .then(({ data: { data } }) => {
          setTrazabilidad(
            data.map((item) => {
              const fecha = dayjs(item.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              const estado = item.estado_glosa_info.nombre;
              const usuario = item.usuario.username;
              let color = "#ff5e5d";
              switch (item.estado_glosa_info.grupo) {
                case "2":
                  color = "#faad14";
                  break;
                case "3":
                  color = "#fa8c16";
                  break;
                case "4":
                  color = "#1677ff";
                  break;
                case "5":
                  color = "#13c2c2";
                  break;
              }

              return {
                dot: <ClockCircleOutlined style={{ color: color }} />,
                children: (
                  <Space
                    direction="vertical"
                    style={{
                      backgroundColor: color,
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
                      <b>Estado:</b> {estado}
                    </Text>
                    <Text>
                      <b>Usuario:</b> {usuario}
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
  }, [id_factura, open]);

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
