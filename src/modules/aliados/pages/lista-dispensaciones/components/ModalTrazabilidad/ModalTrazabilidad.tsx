/* eslint-disable react-hooks/exhaustive-deps */
import { getTrazabilidad } from "@/services/aliados/aliadosAPI";
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

export const ModalTrazabilidad = ({
  open,
  setOpen,
  id_dispensacion,
}: Props) => {
  const [trazabilidad, setTrazabilidad] = useState<TimelineItemProps[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    if (id_dispensacion && open) {
      getTrazabilidad(id_dispensacion)
        .then(({ data: { data } }) => {
          setTrazabilidad(
            data.map((item) => {
              const fecha = dayjs(item.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              const {
                observacion,
                estado,
                usuario: { username },
                motivo,
              } = item;
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
                      <b>Fecha:</b> {fecha}
                    </Text>
                    <Text>
                      <b>Estado:</b> {estado}
                    </Text>
                    <Text>
                      <b>Observación:</b> {observacion}
                    </Text>
                    {motivo ? (
                      <Text>
                        <b>Motivo:</b> {`${motivo.codigo} - ${motivo.motivo}`}
                      </Text>
                    ) : null}
                    <Text>
                      <b>Usuario:</b> {username}
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
  }, [id_dispensacion, open]);

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
