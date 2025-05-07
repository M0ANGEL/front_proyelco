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
  observacion: string;
  numero_ticket: string;
}

export const ObservacionModalCliente = ({
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
      {dataTicket?.observacion ? (
        <Tooltip title={"Observavion del ticket"}>
          <Button
            type="primary"
            onClick={showLoading}
            size="small"
            style={{ marginLeft: "5px", background: "blue" }}
          >
            <FaCommentDots />
          </Button>
        </Tooltip>
      ) : (
        ""
      )}
      <Modal
        title={
          <p>
            OBSERVACION DEL TICKET{" "}
            <span style={{ color: "#23840d" }}>
              {dataTicket?.numero_ticket}
            </span>{" "}
          </p>
        }
        footer={
          <>
            <span style={{ color: "red" }}>
              <b>Revisa la observacion</b> , ve al ojo y realiza los cambios
              sugeridos
            </span>
          </>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Row gutter={24}>
          {/* campo de la observacio*/}
          <div
            style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
          >
            <h4 style={{ textAlign: "center" }}>Detalle de la observacion</h4>
            <Col xs={24} sm={24}>
              <TextArea
                allowClear
                disabled
                rows={3}
                value={dataTicket?.observacion}
              />
            </Col>
          </div>
        </Row>
      </Modal>
    </>
  );
};
