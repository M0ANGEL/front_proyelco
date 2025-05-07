import { Button, Col, Modal, Row, Tooltip } from "antd";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { FaCommentDots } from "react-icons/fa";
import { observacionTkTicket } from "@/services/tickets/administracionAPI";

// Interfaces
interface DataId {
  fetchList: () => void;
  pushNotification: (message: { title: string; type?: string }) => void;
  dataTicket: DataTypeA;
}

interface DataTypeA {
  key: number;
  id: number;
  created_at: string;
  prioridad: string;
  detalle: string;
  estado: string;
  numero_ticket: string;
  autorizacion: string;
  nombre_autorizador: string | null;
  respuesta_autorizacion: string | null;
  userSoluciona_id: number | null;
  categoria: string;
  subcategoria: string;
  creador_ticket: string;
  bodega: string;
  idLogueado: number;
  usuarioGestiona: string | null;
  documento: number;
  nombre_proceso: string;
  observacion: string;
  usuarioAsignado: string | null;
}

export const ModalObservacion = ({
  fetchList,
  pushNotification,
  dataTicket,
}: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const [observacionTicket, setObservacionTicket] = useState<string>("");

  //show
  const showLoading = () => {
    setOpen(true);
  };

  //cierre del ticket
  const EnvioObservacionTicket = () => {
    const cierreTicke = {
      id: dataTicket.id,
      observacion: observacionTicket,
    };

    observacionTkTicket(cierreTicke, dataTicket.id)
      .then(() => {
        pushNotification({
          title: "La observacion se envio exitosamente",
          type: "success",
        });
      })
      .catch((err) => {
        pushNotification({
          title: `Error al enviar la observacion: ${err.message}`,
          type: "error",
        });
      })
      .finally(() => {
        setOpen(false);
        fetchList();
      });
  };

  //jsx
  return (
    <>
      <Tooltip title={"Observavion del ticket"}>
        <Button
          type="primary"
          onClick={showLoading}
          size="small"
          style={{ marginLeft: "5px", background: "#4523ee" }}
        >
          <FaCommentDots />
        </Button>
      </Tooltip>
      <Modal
        title={<p>ENVIO DE OBSERVACION DEL TICKET </p>}
        footer={
          <>
            <Button
              type="primary"
              onClick={EnvioObservacionTicket}
              disabled={!observacionTicket}
              style={{
                display:
                  dataTicket?.observacion || dataTicket?.usuarioAsignado
                    ? "none"
                    : "block",
              }}
            >
              Enviar observacion
            </Button>
          </>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Row gutter={24}>
          {/* campo de dato de respuesta  gestion*/}
          {dataTicket?.observacion || dataTicket?.usuarioAsignado ? (
            <>
              <div
                style={{
                  width: "100%",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              >
                <h4 style={{ textAlign: "center" }}>
                  Detalle de la observacion
                </h4>
                <Col xs={24} sm={24}>
                  <TextArea
                    allowClear
                    disabled
                    rows={3}
                    value={dataTicket?.observacion}
                  />
                </Col>
              </div>
              <span>
                <b>{dataTicket?.observacion ? "Observacion enviada" : "Para poder enviar observacion, el ticket debe estar libre" } </b>
              </span>
            </>
          ) : (
            <div
              style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
            >
              <h4 style={{ textAlign: "center" }}>
                Detalle de la observacion:
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  required
                  name="respuesta_autorizacion"
                  maxLength={255}
                  rows={4}
                  value={observacionTicket}
                  onChange={(e) => setObservacionTicket(e.target.value)}
                />
              </Col>
            </div>
          )}
        </Row>
      </Modal>
    </>
  );
};
