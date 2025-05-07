//NUEVO
import { useEffect, useState } from "react";
import { Props } from "./types";
import {
  Button,
  Col,
  Modal,
  notification,
  Row,
  Skeleton,
  Space,
  Timeline,
  TimelineItemProps,
  Tooltip,
  Typography,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { MdHistory } from "react-icons/md";
import dayjs from "dayjs";
import { getTrazabilidadTicket } from "@/services/tickets/administracionAPI";

const { Text, Title } = Typography;

export const HistorialTicket = ({ id_ticket }: Props) => {
  const [trazabilidad, setTrazabilidad] = useState<TimelineItemProps[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
  }, [open]);

  //data historial

  const getDataHistorial = () => {
    getTrazabilidadTicket(id_ticket)
      .then(({ data: { data } }) => {
        setTrazabilidad(
          data.map((item: any) => {
            const fecha = dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss");
            /* const ButtonEstadosAntiguo = () => {
              switch (item.estado_antiguo) {
                case "1":
                  return "Ticket Creado. ";
                  break;
                case "2":
                  return "Ticket En gestion.";
                  break;

                case "3":
                  return "Ticket Realizado. ";
                  break;

                case " 4":
                  return "Ticket Calificado. ";
                  break;

                case "5":
                  return "Ticket Auto Cancelado. ";
                  break;

                case "6":
                  return "Ticket Rechazado. ";
                  break;

                case "7":
                  return "Ticket Rechazado Para Gestion. ";
                  break;

                default:
                  return "Incio Del Ticket.";
                  break;
              }
            }; */

        
            const ButtonEstadoAutorizado = () => {
              switch (item.estado_autorizacion) {
                case "0":
                  return "NO NECESITA AUTORIZACION ";
                  break;
                case "1":
                  return "SIN AUTORIZAR ";
                  break;
                case "2":
                  return "AUTORIZADO ";
                  break;

                  case "3":
                    return "AUTORIZACION RECHAZADA ";
                    break;

                default:
                  return "Incio Del Ticket";
                  break;
              }
            };
            const {
              mensaje,
              usuario_envia,
              usuario_asignado,
              usuario_envia_proceso,
              estado,
            } = item;
            const colors = [
              "#3a8ff9",
              "#3adcf9",
              "#53cf53", //verde
              "#1677ff",
              "#5368cf",
              "#655280",
              "#154cdd",
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
                    <b>FECHA</b> <br /> {fecha}
                  </Text>
                  <Text>
                    <b>USUARIO</b> <br /> {usuario_envia}
                  </Text>
                  <Text>
                    <b>PROCESO</b> <br /> {usuario_envia_proceso}
                  </Text>
                  <Text>
                    <b>USUARIO ASIGNADO</b> <br />
                    {usuario_asignado ? usuario_asignado : "SIN ASIGNAR"}
                  </Text>
                  {/* <Text>
                    <b>ESTADO ANTERIOR</b> <br /> {ButtonEstadosAntiguo()}
                  </Text> */}
                  <Text>
                    <b>ESTADO</b> <br /> {estado}
                  </Text>
                  <Text>
                    <b>ESTADO AUTORIZACION</b> <br /> {ButtonEstadoAutorizado()}
                  </Text>
                  <Text>
                    <b>MENSAJE</b> <br /> {mensaje}
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
  };

  const showLoading = () => {
    setOpen(true);
    getDataHistorial();
  };

  return (
    <>
      {contextHolder}
      <Tooltip title="Historial Ticket">
        <Button
          type="primary"
          style={{ background: "green", marginLeft: "5px" }}
          onClick={showLoading}
          size="small"
        >
          <MdHistory />
        </Button>
      </Tooltip>
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
              Trazabilidad del ticket
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
