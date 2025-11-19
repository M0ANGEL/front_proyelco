import {
  Button,
  Col,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getActiBodegas } from "@/services/activosFijos/BodegasAPI";
import { envioSolicitudActivo } from "@/services/activosFijos/TrasladosActivosAPI";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { ActivosData } from "@/types/typesGlobal";
import { StyledFormItem } from "@/components/layout/styled";

interface GenerarQRProps {
  data: ActivosData;
  fetchList: () => void;
}

interface DataSelect {
  label: string | null;
  value: number | null;
}

export const SolicitarForm = ({ data, fetchList }: GenerarQRProps) => {
  const [visible, setVisible] = useState(false);
  const [bodegas, setBodegas] = useState<DataSelect[]>([]);
  const [bodegaSelecionadaDestino, setBodegaSelecionadaDestino] = useState<
    number | null
  >(null);
  const [observacionActivo, setObservacionActivo] = useState<string>("");
  const [helpVisible, setHelpVisible] = useState(false);

  // 👇 nuevo state para condición del activo

  useEffect(() => {
    if (visible == true) {
      getActiBodegas().then(({ data: { data } }) => {
        const opciones = data.map((item) => ({
          label: item.nombre.toUpperCase(),
          value: item.id,
        }));
        setBodegas(opciones);
      });
    }
  }, [visible]);

  //trasladar
  const trasladarActivo = () => {
    const rechazoTicket = {
      id: data.key,
      observacion: observacionActivo,
      ubicacion_destino: bodegaSelecionadaDestino,
      tipoUbicacion: 1,
      activo: data.id,
    };

    envioSolicitudActivo(rechazoTicket)
      .then(() => {
        notification.success({
          message: "El activo fue trasladado",
          description: "El activo fue trasladado correctamente.",
          placement: "topRight",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error al trasladar activo",
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
      <Tooltip
        title={
          data.solicitud == "1"
            ? "Activo solicitado (estado pendiente)"
            : "Solicitar Activo"
        }
      >
        <Button
          icon={<AiOutlineIssuesClose />}
          type="primary"
          size="small"
          disabled={data.solicitud == "1" ? true : false}
          onClick={() => setVisible(true)}
          style={{ marginLeft: "5px", background: "#17ae00ff" }}
        />
      </Tooltip>

      <Modal
        title={`Traslado del activo ${data.numero_activo}`}
        open={visible}
        onCancel={() => setVisible(false)}
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
            onClick={() => setVisible(false)}
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
              background:
                observacionActivo.length !== 0 ? "#003daeff" : "#adc0e4ff",
            }}
            disabled={observacionActivo.length === 0}
          >
            Solicitar Activo
          </Button>,
        ]}
        centered
      >
        <Row gutter={24}>
          {/* categoria */}
          <Col xs={24} sm={12}>
            <StyledFormItem label="Categoría Padre" labelCol={{ span: 24 }}>
              <Input value={data.categoria} disabled />
            </StyledFormItem>
          </Col>

          {/* subacategoria  */}
          <Col xs={24} sm={12}>
            <StyledFormItem label="Subcategoría" labelCol={{ span: 24 }}>
              <Input value={data.subcategoria} disabled />
            </StyledFormItem>
          </Col>

          {/* descripcion */}
          <Col xs={24}>
            <StyledFormItem label="Descripción" labelCol={{ span: 24 }}>
              <TextArea value={data?.descripcion || "..."} disabled />
            </StyledFormItem>
          </Col>

          {/* ubicacion actual activo */}
          <Col xs={24} sm={12}>
            <StyledFormItem label="Ubicación Actual" labelCol={{ span: 24 }}>
              <Input value={data.bodega_actual} disabled />
            </StyledFormItem>
          </Col>

          {/* ubicacion destino activo */}
          <Col xs={24} sm={24}>
            <StyledFormItem
              label="Ubicación destino del activo"
              labelCol={{ span: 24 }}
            >
              <Select
                showSearch
                allowClear
                options={bodegas}
                onChange={(value) => setBodegaSelecionadaDestino(value)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .localeCompare(
                      (optionB?.label ?? "").toString().toLowerCase()
                    )
                }
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toString().toLowerCase())
                }
              />
            </StyledFormItem>
          </Col>

          {/* observacion */}
          <Col xs={24}>
            <StyledFormItem label="Observación" labelCol={{ span: 24 }}>
              <TextArea
                allowClear
                required
                placeholder="Escribe una observación de la solicitud"
                rows={5}
                value={observacionActivo}
                onChange={(e) => setObservacionActivo(e.target.value)}
              />
            </StyledFormItem>
          </Col>
        </Row>
      </Modal>

      <Modal
        title="¿Cómo funciona solicitar un activo?"
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
          <strong>1. Ubicación destino:</strong> Selecciona la bodega a la que
          deseas que se traslade el activo.
        </p>
        <p>
          <strong>2. Observación:</strong> Describe por qué estás solicitando el
          activo o para qué lo necesitas.
        </p>
        <p>
          <strong>3. Importante:</strong> La solicitud quedará pendiente hasta
          ser aprobada por la persona que lo tiene asignado.
        </p>
        <p>
          Una vez completes la información, haz clic en{" "}
          <strong>“Solicitar Activo”</strong>.
        </p>
      </Modal>
    </>
  );
};
