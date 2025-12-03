import { Button, Col, Modal, notification, Row, Tooltip, Select, Form } from "antd";
import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { aceptarActivo } from "@/services/activosFijos/TrasladosActivosAPI";
import { GreenButton, StyledFormItem } from "@/components/layout/styled";


export const ModalExportacionActivos = () => {
  const [visible, setVisible] = useState(false);
  const [observacionActivo, setObservacionActivo] = useState<string>("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("");
  const [form] = Form.useForm();
  const [cargando, setCargando] = useState(false);

  // Opciones para los selects
  const opcionesEstado = [
    { value: 0, label: "Sin Trasladar" },
    { value: 2, label: "Pendiente" },
    { value: 3, label: "Aceptado" },

  ];


  // Obtener los filtros seleccionados para la API
  const obtenerFiltrosParaAPI = () => {
    const filtros: Record<string, string> = {};
    
    if (estadoSeleccionado) {
      filtros.estado = estadoSeleccionado;
    }
    return filtros;
  };

  // Aceptar activo
  const AceptarActivoFuncion = async () => {

    setCargando(true);
    
    try {
      const datosParaAPI = {
        observacion: observacionActivo,
        filtros: obtenerFiltrosParaAPI(),
        // Agregar otros datos del formulario si es necesario
        ...form.getFieldsValue()
      };

      console.log("Datos a enviar a la API:", datosParaAPI);
      
      await aceptarActivo(datosParaAPI);
      
      notification.success({
        message: "Activos exportados/aceptados",
        description: "La operación se realizó correctamente.",
        placement: "topRight",
      });
      
      // Resetear el formulario
      setVisible(false);
      form.resetFields();
      setObservacionActivo("");
      setEstadoSeleccionado("");
      
    } catch (err: any) {
      notification.error({
        message: "Error en la operación",
        description: err.message || "Ocurrió un error al procesar la solicitud.",
        placement: "topRight",
      });
      console.error("Error:", err);
    } finally {
      setCargando(false);
    }
  };



  return (
    <>
      <Tooltip title="Exportar Excel">
        <GreenButton
          icon={<AiOutlineCheck />}
          type="default"
          size="small"
          onClick={() => setVisible(true)}
          style={{marginBottom: "5px"}}
        >
          Exportar
        </GreenButton>
      </Tooltip>

      <Modal
        title="Exportar Activos"
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setObservacionActivo("");
        }}
        footer={[
          <Button
            key="cancelar"
            onClick={() => {
              setVisible(false);
              form.resetFields();
              setObservacionActivo("");
            }}
            style={{
              color: "white",
              background: "#ce2222",
            }}
          >
            Cancelar
          </Button>,
          <Button
            key="aceptar"
            type="primary"
            onClick={AceptarActivoFuncion}
            loading={cargando}
            disabled={!estadoSeleccionado}
          >
            {cargando ? "Procesando..." : "Exportar Activos"}
          </Button>,
        ]}
        centered
        width={500}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            {/* Estado del activo */}
            <Col xs={24} sm={24}>
              <StyledFormItem label="Estado">
                <Select
                  mode="multiple" // Permite seleccionar varios valores
                  showSearch
                  allowClear
                  options={opcionesEstado} // Opciones predefinidas
                  placeholder={"Selecciona uno o más usuarios"}
                  tokenSeparators={[","]}
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
          </Row>
        </Form>
      </Modal>
    </>
  );
};