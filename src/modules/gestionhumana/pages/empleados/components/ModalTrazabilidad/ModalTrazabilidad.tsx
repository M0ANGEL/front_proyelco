import { useEffect, useState } from 'react';
import { Props } from './types';
import { Col, Modal, notification, Row, Skeleton, Space, Timeline, TimelineItemProps, Typography } from 'antd';
import { ClockCircleOutlined } from "@ant-design/icons";
import { getTrazabilidad } from '@/services/gestion-humana/trazabilidadAPI';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

export const ModalTrazabilidad = ({open, setOpen, id_empleado,}: Props) => {

  const [trazabilidad, setTrazabilidad] = useState<TimelineItemProps[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);

  
  useEffect(() => {
    setLoader(true);
    if (id_empleado && open) {
      getTrazabilidad(id_empleado)
        .then(({ data: { data } }) => {
          setTrazabilidad(
            data.map((item: any) => {
              const fecha = dayjs(item.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              const {
                salario,
                nombre_completo,
                cargo,
                usuario,
                // contrato,
                // usuario: { username },
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
                      <b>Empleado:</b> {nombre_completo}
                    </Text>
                    <Text>
                      <b>Cargo:</b> {cargo}
                    </Text>
                    <Text>
                      <b>Salario:</b> ${salario}
                    </Text>
                    {/* <Text>
                      <b>Contrato:</b> {contrato}
                    </Text> */}
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
  }, [id_empleado, open]);

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
  )
}