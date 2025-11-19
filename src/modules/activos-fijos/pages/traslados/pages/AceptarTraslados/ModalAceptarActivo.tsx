import { Button, Col, Input, Modal, notification, Row, Tooltip } from "antd";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { AiOutlineCheck } from "react-icons/ai";
import { aceptarActivo } from "@/services/activosFijos/TrasladosActivosAPI";
import { ActivosData } from "@/types/typesGlobal";
import { StyledFormItem } from "@/components/layout/styled";

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
          message: "El activo fue aceptado",
          description: "El activo fue aceptado correctamente.",
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
          type="default"
          size="small"
          onClick={() => setVisible(true)}
          style={{ marginLeft: "5px", background: "#52c41a", color: "white" }}
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
          {/* mas data para personas que usan celular */}
          {/* categoria */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Categoría Padre" labelCol={{ span: 24 }}>
              <Input value={data.categoria} disabled />
            </StyledFormItem>
          </Col>

          {/* subacategoria  */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Subategoría" labelCol={{ span: 24 }}>
              <Input value={data.subcategoria} disabled />
            </StyledFormItem>
          </Col>

          {/* descripcion */}
          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem label="Descripción" labelCol={{ span: 24 }}>
              <TextArea value={data?.descripcion || "..."} disabled />
            </StyledFormItem>
          </Col>

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
