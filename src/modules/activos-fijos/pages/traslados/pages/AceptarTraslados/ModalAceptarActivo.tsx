import { Button, Col, Modal, notification, Row, Tooltip } from "antd";
import { useState } from "react";
import { ActivosData } from "@/services/types";
import TextArea from "antd/es/input/TextArea";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { AiOutlineCheck } from "react-icons/ai";
import { aceptarActivo } from "@/services/activosFijos/TrasladosActivosAPI";

interface GenerarQRProps {
  data: ActivosData;
  fetchList: () => void;
}


export const ModalAceptarActivo = ({ data, fetchList }: GenerarQRProps) => {
  const [visible, setVisible] = useState(false);
  const [observacionActivo, setObservacionActivo] = useState<string>("");

  //Aceptar activo
  const AceptarActivoFuncion = () => {
    const rechazoTicket = {
      id: data.key,
      observacion: observacionActivo,
    };

    aceptarActivo(rechazoTicket)
      .then(() => {
        notification.success({
          message: "El activo fue rechazado",
          description: "El activo fue rechazado correctamente.",
          placement: "topRight",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error al Aceptar activo",
          description: err.message || "Ocurrió un error inesperado.",
          placement: "topRight",
        });
      })
      .finally(() => {
        fetchList();
        setVisible(false);
      });
  };

  return (
    <>
      <Tooltip title="Aceptar Activo">
        <Button
          icon={<AiOutlineCheck />}
          type="primary"
          size="small"
          onClick={() => setVisible(true)}
          style={{
            backgroundColor: "#52c41a",
            borderColor: "#52c41a",
          }}
        />
      </Tooltip>

      <Modal
        title={`Aceptar el activo ${data.numero_activo}`}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <>
            <Button
              key="close"
              onClick={() => setVisible(false)}
              style={{
                marginLeft: "5px",
                color: "white",
                background: "#ce2222ff",
              }}
            >
              Cerrar
            </Button>
            <Button
              key="close"
              onClick={() => AceptarActivoFuncion()}
              style={{
                marginLeft: "5px",
                color: "white",
                background:
                  observacionActivo.length !== 0 ? "#003daeff" : "#adc0e4ff",
              }}
              disabled={observacionActivo.length === 0}
            >
              Aceptar Activo
            </Button>
          </>,
        ]}
        centered
      >
        <Row gutter={24}>
          {/* observacion */}
          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem label="Observacion" labelCol={{ span: 24 }}>
              <TextArea
                allowClear
                required
                placeholder="Escribe una observacion del activo"
                rows={5}
                value={observacionActivo}
                onChange={(e) => setObservacionActivo(e.target.value)}
              />
            </StyledFormItem>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
