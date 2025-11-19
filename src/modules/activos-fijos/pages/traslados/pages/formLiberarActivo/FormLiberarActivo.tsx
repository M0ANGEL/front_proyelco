import {
  Alert,
  Button,
  Col,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";

import { LiberarActiActivo } from "@/services/activosFijos/TrasladosActivosAPI";
import { AiOutlineRedo } from "react-icons/ai";
import { ActivosData } from "@/types/typesGlobal";
import { StyledFormItem } from "@/components/layout/styled";

interface GenerarQRProps {
  data: ActivosData;
  fetchList: () => void;
}

export const FormLiberarActivo = ({ data, fetchList }: GenerarQRProps) => {
  const [visible, setVisible] = useState(false);
  const [observacionActivo, setObservacionActivo] = useState<string>("");
  const [requiereMensajero, setRequiereMensajero] = useState<boolean | null>(
    null
  );
  const [helpVisible, setHelpVisible] = useState(false);

  // Función para validar si el formulario es válido
  const isFormValid = () => {
    return observacionActivo.trim().length > 0 && requiereMensajero !== null;
  };

  //trasladar
  const trasladarActivo = () => {
    // Validación adicional antes de enviar
    if (!isFormValid()) {
      notification.warning({
        message: "Datos incompletos",
        description: "Por favor complete todos los campos obligatorios.",
        placement: "topRight",
      });
      return;
    }

    const rechazoTicket = {
      id: data.key,
      observacion: observacionActivo,
      requiere_mensajero: requiereMensajero,
    };

    LiberarActiActivo(rechazoTicket)
      .then(() => {
        notification.success({
          message: "El activo fue liberado",
          description: "El activo fue liberado correctamente.",
          placement: "topRight",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error al liberar activo",
          description: err.message || "Ocurrió un error inesperado.",
          placement: "topRight",
        });
      })
      .finally(() => {
        fetchList();
        setVisible(false);
        // Resetear formulario
        setObservacionActivo("");
        setRequiereMensajero(null);
      });
  };

  return (
    <>
      <Tooltip title="Liberar Activo">
        <Button
          icon={<AiOutlineRedo />}
          type="default"
          size="small"
          onClick={() => setVisible(true)}
          style={{ marginLeft: "5px", background: "red", color: "white" }}
        />
      </Tooltip>

      <Modal
        title={`Liberar el activo ${data.numero_activo}`}
        open={visible}
        onCancel={() => {
          setVisible(false);
          // Resetear formulario al cancelar
          setObservacionActivo("");
          setRequiereMensajero(null);
        }}
        footer={[
          <div
            key="leftButtons"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Button style={{background: "#f3cb73ff", color: "white"}} onClick={() => setHelpVisible(true)}>Ayuda</Button>
          </div>,

          <Button
            key="close"
            onClick={() => {
              setVisible(false);
              setObservacionActivo("");
              setRequiereMensajero(null);
            }}
            style={{
              marginLeft: "5px",
              color: "white",
              background: "#ce2222ff",
            }}
          >
            Cerrar
          </Button>,

          <Button
            key="submit"
            onClick={() => trasladarActivo()}
            style={{
              marginLeft: "5px",
              color: "white",
              background: isFormValid() ? "#003daeff" : "#adc0e4ff",
            }}
            disabled={!isFormValid()}
          >
            Liberar Activo
          </Button>,
        ]}
        centered
      >
        <Row gutter={24}>
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

          {/* requiere mensajero - OBLIGATORIO */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem
              label="Requiere mensajero?"
              labelCol={{ span: 24 }}
              required
              validateStatus={requiereMensajero !== null ? "success" : "error"}
              help={
                requiereMensajero !== null ? "" : "Este campo es obligatorio"
              }
            >
              <Select
                placeholder="Seleccione una opción"
                options={[
                  { label: "Sí", value: 1 },
                  { label: "No", value: 0 },
                ]}
                onChange={(value) => setRequiereMensajero(value)}
                status={requiereMensajero !== null ? "" : "error"}
                value={requiereMensajero}
              />
            </StyledFormItem>
          </Col>

          {/* observacion - OBLIGATORIO */}
          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem
              label="Observación"
              labelCol={{ span: 24 }}
              required
              validateStatus={
                observacionActivo.trim().length > 0 ? "success" : "error"
              }
              help={
                observacionActivo.trim().length > 0
                  ? ""
                  : "Este campo es obligatorio"
              }
            >
              <TextArea
                allowClear
                placeholder="Escribe una observación del activo"
                rows={5}
                value={observacionActivo}
                onChange={(e) => setObservacionActivo(e.target.value)}
                status={observacionActivo.trim().length > 0 ? "" : "error"}
              />
            </StyledFormItem>
            <Alert
              message="Nota: Al liberar el activo, este regresará automáticamente a la bodega general. Debes confirmar si necesitas que un mensajero vaya por el activo."
              type="success"
            />
          </Col>
        </Row>
      </Modal>

      <Modal
        title="¿Cómo funciona liberar un activo?"
        open={helpVisible}
        onCancel={() => setHelpVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHelpVisible(false)}>
            Cerrar
          </Button>,
        ]}
        centered
      >
        <p>
          <strong>1. Observación:</strong> Explica la razón por la cual estás
          liberando el activo.
        </p>
        <p>
          <strong>2. Requiere mensajero:</strong> Indica si necesitas que un
          mensajero recoja el activo.
        </p>
        <p>
          <strong>3. Importante:</strong> Al liberar un activo, este regresará
          automáticamente a la bodega general.
        </p>
        <p>
          Una vez completes la información, haz clic en{" "}
          <strong>“Liberar Activo”</strong>.
        </p>
      </Modal>
    </>
  );
};
