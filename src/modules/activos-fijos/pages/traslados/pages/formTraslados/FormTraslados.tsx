import {
  Button,
  Col,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Tooltip,
  Form,
} from "antd";
import { useEffect, useState } from "react";
import { FaUserCheck } from "react-icons/fa6";
import TextArea from "antd/es/input/TextArea";
import { getActiUsers } from "@/services/activosFijos/CrearActivosAPI";
import { getActiBodegas } from "@/services/activosFijos/BodegasAPI";
import { trasladarActiActivo } from "@/services/activosFijos/TrasladosActivosAPI";
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

export const FormTraslados = ({ data, fetchList }: GenerarQRProps) => {
  const [visible, setVisible] = useState(false);
  const [usuarios, setUsuarios] = useState<DataSelect[]>([]);
  const [bodegas, setBodegas] = useState<DataSelect[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string[]>([]);
  const [requiereMensajero, setRequiereMensajero] = useState<boolean | null>(null);
  const [bodegaSelecionadaDestino, setBodegaSelecionadaDestino] = useState<number | null>(null);
  const [observacionActivo, setObservacionActivo] = useState<string>("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible == true) {
      fetchUsuarios();
      fechBodegas();
      // // Resetear form cuando se abre el modal
      // form.resetFields();
      // setUsuarioSeleccionado([]);
      // setRequiereMensajero(null);
      // setBodegaSelecionadaDestino(null);
      // setObservacionActivo("");
    }
  }, [visible]);

  const fechBodegas = () => {
    getActiBodegas().then(({ data: { data } }) => {
      const opciones = data.map((item) => ({
        label: item.nombre.toUpperCase(),
        value: item.id,
      }));
      setBodegas(opciones);
    });
  };

  //llamado de usuarios
  const fetchUsuarios = () => {
    getActiUsers().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.nombre.toUpperCase(),
        value: item.id,
      }));
      setUsuarios(categoriasPadres);
    });
  };

  // Función para validar si el formulario está completo
  const isFormValid = () => {
    if (data.solicitud == "1") {
      // Para solicitudes, solo observación y mensajero son obligatorios
      return observacionActivo.trim().length > 0 && requiereMensajero !== null;
    } else {
      // Para traslados normales, todos los campos son obligatorios
      return (
        observacionActivo.trim().length > 0 &&
        requiereMensajero !== null &&
        bodegaSelecionadaDestino !== null &&
        usuarioSeleccionado.length > 0
      );
    }
  };

  //trasladar
  const trasladarActivo = () => {
    if (!isFormValid()) {
      notification.warning({
        message: "Campos incompletos",
        description: "Por favor complete todos los campos obligatorios",
        placement: "topRight",
      });
      return;
    }

    setLoading(true);

    const rechazoTicket = {
      id: data.key,
      observacion: observacionActivo,
      ubicacion_destino: bodegaSelecionadaDestino,
      usuarios: usuarioSeleccionado,
      tipo_ubicacion: 1, //se quita tipo ubicacion
      solicitud: data.solicitud ? data.solicitud : 0,
      requiere_mensajero: requiereMensajero,
    };

    trasladarActiActivo(rechazoTicket)
      .then(() => {
        notification.success({
          message: "El activo fue trasladado",
          description: "El activo fue trasladado correctamente.",
          placement: "topRight",
        });
        setVisible(false);
        fetchList();
      })
      .catch((err) => {
        notification.error({
          message: "Error al trasladar activo",
          description: err.message || "Ocurrió un error inesperado.",
          placement: "topRight",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Tooltip title="Trasladar Activo">
        <Button
          icon={<FaUserCheck />}
          type="primary"
          size="small"
          onClick={() => setVisible(true)}
          style={{ marginLeft: "5px", background: "#17ae00ff" }}
        />
      </Tooltip>

      <Modal
        title={`Traslado del activo ${data.numero_activo}`}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setVisible(false)}
            style={{
              color: "white",
              background: "#ce2222ff",
            }}
          >
            Cerrar
          </Button>,
          <Button
            key="submit"
            onClick={trasladarActivo}
            style={{
              color: "white",
              background: isFormValid() ? "#003daeff" : "#adc0e4ff",
            }}
            disabled={!isFormValid()}
            loading={loading}
          >
            Trasladar Activo
          </Button>,
        ]}
        centered
      >
        <Form form={form} layout="vertical">
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

            {data.solicitud == "1" ? (
              <>
                {/* motivo solicitud */}
                <Col xs={24} sm={24} style={{ width: "100%" }}>
                  <StyledFormItem
                    label="Descripción Solicitud"
                    labelCol={{ span: 24 }}
                  >
                    <TextArea
                      value={data?.motivo_solicitud || "Sin motivo"}
                      disabled
                    />
                  </StyledFormItem>
                </Col>

                {/* usuario que hace la solitud */}
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <StyledFormItem
                    label="Usuario Solicita"
                    labelCol={{ span: 24 }}
                  >
                    <Input value={data.usuario_solicita} disabled />
                  </StyledFormItem>
                </Col>

                {/* campo de ubicacion actual activo */}
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <StyledFormItem
                    label={
                      data.solicitud == "1"
                        ? "Ubicación Destino"
                        : "Ubicación Actual"
                    }
                    labelCol={{ span: 24 }}
                  >
                    <Input value={data.bodega_actual} disabled />
                  </StyledFormItem>
                </Col>
              </>
            ) : (
              ""
            )}

            {data.solicitud != "1" ? (
              <>
                {/* ubicacion destino activo - OBLIGATORIO */}
                <Col xs={24} sm={24}>
                  <StyledFormItem
                    label="Ubicación destino del activo"
                    labelCol={{ span: 24 }}
                    required
                    validateStatus={bodegaSelecionadaDestino ? "success" : "error"}
                    help={bodegaSelecionadaDestino ? "" : "Este campo es obligatorio"}
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
                      status={bodegaSelecionadaDestino ? "" : "error"}
                    />
                  </StyledFormItem>
                </Col>

                {/* campo de usuarios - OBLIGATORIO (CUANDO SE USE VARIOS USAURIOS) */}
                <Col xs={24} sm={24} style={{ width: "100%" }}>
                  <StyledFormItem
                    label="Usuarios para asignación"
                    labelCol={{ span: 24 }}
                    required
                    validateStatus={usuarioSeleccionado.length > 0 ? "success" : "error"}
                    help={usuarioSeleccionado.length > 0 ? "" : "Seleccione al menos un usuario"}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      allowClear
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
                      options={usuarios}
                      onChange={(value) =>
                        setUsuarioSeleccionado(value.map((v) => String(v)))
                      }
                      status={usuarioSeleccionado.length > 0 ? "" : "error"}
                    />
                  </StyledFormItem>
                </Col>
              </>
            ) : (
              ""
            )}

            {/* requiere mensajero - OBLIGATORIO */}
            <Col xs={24} sm={12} style={{ width: "100%" }}>
              <StyledFormItem 
                label="Requiere mensajero?" 
                labelCol={{ span: 24 }}
                required
                validateStatus={requiereMensajero !== null ? "success" : "error"}
                help={requiereMensajero !== null ? "" : "Este campo es obligatorio"}
              >
                <Select
                  placeholder="Seleccione una opción"
                  options={[
                    { label: "Sí", value: 1 },
                    { label: "No", value: 0 },
                  ]}
                  onChange={(value) => setRequiereMensajero(value)}
                  status={requiereMensajero !== null ? "" : "error"}
                />
              </StyledFormItem>
            </Col>

            {/* observacion - OBLIGATORIO */}
            <Col xs={24} sm={24} style={{ width: "100%" }}>
              <StyledFormItem 
                label="Observación" 
                labelCol={{ span: 24 }}
                required
                validateStatus={observacionActivo.trim().length > 0 ? "success" : "error"}
                help={observacionActivo.trim().length > 0 ? "" : "Este campo es obligatorio"}
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
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};