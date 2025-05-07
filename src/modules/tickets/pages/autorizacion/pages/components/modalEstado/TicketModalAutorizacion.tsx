import { Button, Col, Input, Modal, Row, Spin } from "antd";
import { useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import { AutorizarTkTicket } from "@/services/tickets/autorizacionAPI";
import { BsFillPatchCheckFill } from "react-icons/bs";

interface DataId {
  dataTicket: DataType;
  fetchList: () => void;
  pushNotification: (message: { title: string; type?: string }) => void;
}

interface DataType {
  key: number;
  id: number;
  numero_ticket: string;
  detalle: string;
  created_at: string;
  estado: string;
  categoria: string;
  subcategoria: string;
  bodega: string;
  creador_ticket: string;
  nombre_proceso: string;
}

export const TicketModalAutorizacion = ({
  dataTicket,
  fetchList,
  pushNotification,
}: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const [autorizacion, setAutorizacion] = useState<string>("");
  const [identifi, setIdentifi] = useState<boolean>(false);
  const [displayButtonAuto, setDisplayButtonAuto] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayButtonRechazo, setDisplayButtonRechazo] =
    useState<boolean>(false);

  const showLoading = () => {
    setOpen(true);
  };

  const OpcionRechazo = () => {
    setIdentifi(false);
    setDisplayButtonRechazo(true);
  };

  const OpcionAuto = () => {
    setIdentifi(true);
    setDisplayButtonAuto(true);
  };

  const EnvioAutorizacion = () => {
    setLoading(true);

    const AutoRechazo: number = identifi ? 1 : 2;

    const AutorizacionTicket = {
      id: Number(dataTicket.id),
      indetificador: AutoRechazo,
      respuesta_autorizacion: autorizacion,
    };

    AutorizarTkTicket(AutorizacionTicket, dataTicket.id)
      .then(() => {
        pushNotification({
          title: "Ticket Autorizado",
          type: "info",
        });
      })
      .catch((err) => {
        pushNotification({
          title: `Error: ${"El ticket ya fue autorizado " + err.message}`,
          type: "error",
        });
      })
      .finally(() => {
        setOpen(false);
        setLoading(false);
        fetchList();
      });
  };

  return (
    <>
      <Button type="primary" onClick={showLoading} size="small">
        <BsFillPatchCheckFill />
      </Button>

      <Modal
        title={
          <p>
            INFORMACIÓN DEL TICKET{" "}
            <span style={{ color: "#23840d" }}>
              {dataTicket?.numero_ticket}
            </span>
          </p>
        }
        footer={
          <>
            {!displayButtonAuto ? (
              <Button
                type="primary"
                onClick={OpcionAuto}
                disabled={displayButtonRechazo || loading}
              >
                Autorizar la gestion del ticket
              </Button>
            ) : (
              <Button
                type="primary"
                disabled={!autorizacion || loading}
                onClick={EnvioAutorizacion}
              >
                Confirmar Autorización ticket
              </Button>
            )}

            {!displayButtonRechazo ? (
              <Button
                type="primary"
                style={{ background: displayButtonAuto ? "#f15757" : "red" }}
                disabled={displayButtonAuto || loading}
                onClick={OpcionRechazo}
              >
                Rechazar 
              </Button>
            ) : (
              <Button
                type="primary"
                style={{ background: "red" }}
                onClick={EnvioAutorizacion}
                disabled={!autorizacion || loading}
              >
                Confirmar Rechazo
              </Button>
            )}
          </>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setDisplayButtonAuto(false);
          setDisplayButtonRechazo(false);
        }}
        width={800}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Categoría" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.categoria} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Subcategoría" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.subcategoria} />
            </StyledFormItem>
          </Col>

          <div style={{ width: "100%", marginTop: "15px" }}>
            <h4 style={{ textAlign: "center" }}>Detalle del ticket</h4>
            <Col xs={24} sm={24}>
              <TextArea
                allowClear
                disabled
                rows={3}
                value={dataTicket?.detalle}
              />
            </Col>
          </div>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Fecha de creación" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.created_at} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Bodega Solicitante" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.bodega} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Usuario Solicitante" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.creador_ticket} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Proceso" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.nombre_proceso} />
            </StyledFormItem>
          </Col>

          <div style={{ width: "100%", marginTop: "20px" }}>
            <h4 style={{ color: "red", textAlign: "center" }}>
              Mensaje Autorización
            </h4>
            <Col xs={24} sm={24}>
              <TextArea
                allowClear
                required
                name="respuesta_autorizacion"
                maxLength={210}
                value={autorizacion}
                placeholder="Escribe el detalle de la autorización"
                onChange={(e) => setAutorizacion(e.target.value)}
              />
            </Col>
          </div>
        </Row>
      </Modal>

      {/* Modal de Carga (Sniper) */}
      <Modal
        open={loading}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <p style={{ marginTop: "10px" }}>Procesando autorización...</p>
        </div>
      </Modal>
    </>
  );
};
