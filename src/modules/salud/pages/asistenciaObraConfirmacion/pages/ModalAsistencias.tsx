import { Button, Col, Input, Modal, Row, Select, Tooltip } from "antd";
import { useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import { confirmarAsistencia, confirmarNoAsistencia } from "@/services/talento-humano/confirmarAsistenciasAPI";

interface DataId {
  dataTicket: DataType;
  fetchList: () => void;
  pushNotification: (message: { title: string; type?: string }) => void;
}

interface DataType {
  key: number;
  id: number;
  fecha_confirmacion: string;
  detalle: string;
  nombres: string;
  apellidos: string;
  descripcion_proyecto: string;
}

export const ModalAsistencias = ({
  dataTicket,
  fetchList,
  pushNotification,
}: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const [confirmacion, setConfirmacion] = useState<string>("");
  const [motivoSeleccionado, setMotivoSeleccionado] = useState(null);
  const [rechazo, setRechazo] = useState<boolean>(false);
  const showLoading = () => {
    setOpen(true);
  };

  const cancelar = () => {
    setOpen(false);
    setRechazo(false);
  };

  const OpcionesNoAsistencia = [
    { label: "INCAPACIDAD", value: "INCAPACIDAD" },
    { label: "CONFIRMADO", value: "CONFIRMADO" },
    { label: "CITA MEDICA", value: "CITA MEDICA" },
    {
      label: "NO LABORA (NO TRABAJA LOS SAADOS)",
      value: "NO LABORA (NO TRABAJA LOS SAADOS)",
    },
    { label: "EXAMEN MEDICO", value: "EXAMEN MEDICO" },
    { label: "CURSO DE ALTURA", value: "CURSO DE ALTURA" },
    { label: "INGRESO", value: "INGRESO" },
    { label: "VACACIONES", value: "VACACIONES" },
    {
      label: "NO LABORO (LICENCIA NO REMUNERADA)",
      value: "NO LABORO (LICENCIA NO REMUNERADA)",
    },
    {
      label:
        "NO ASISTIO SIN SOPORTE (LICENCIA NO REMUNERADA CON DESCUENTO DOMINICAL)",
      value:
        "NO ASISTIO SIN SOPORTE (LICENCIA NO REMUNERADA CON DESCUENTO DOMINICAL)",
    },
    { label: "PERMISO POR ESTUDIO", value: "PERMISO POR ESTUDIO" },
    { label: "HORAS EXTRAS", value: "HORAS EXTRAS" },
    { label: "HORA NOCTURNA", value: "HORA NOCTURNA" },
    { label: "HORA DOMINICAL", value: "HORA DOMINICAL" },
    { label: "HORA FESTIVA", value: "HORA FESTIVA" },
    { label: "MEDIO DIA DE CUMPLEAÑOS", value: "MEDIO DIA DE CUMPLEAÑOS" },
  ];

  const DespliegueOpciones = () => {
    setRechazo(true);
  };

  const EnvioConfirmacion = () => {
    const AutorizacionTicket = {
      id: Number(dataTicket.id),
      detalle: confirmacion,
    };

    confirmarAsistencia(AutorizacionTicket)
      .then(() => {
        pushNotification({
          title: "Asistencia Confirmada",
          type: "info",
        });
      })
      .catch((err) => {
        pushNotification({
          title: err.message,
          type: "error",
        });
      })
      .finally(() => {
        setOpen(false);
        fetchList();
      });
  };

  const EnvioNoAsistencia = () => {
    const AutorizacionTicket = {
      id: Number(dataTicket.id),
      detalle: confirmacion,
      motivo: motivoSeleccionado,
    };

    confirmarNoAsistencia(AutorizacionTicket)
      .then(() => {
        pushNotification({
          title: "No Asistencia Confirmada",
          type: "info",
        });
      })
      .catch((err) => {
        pushNotification({
          title: err.message,
          type: "error",
        });
      })
      .finally(() => {
        setOpen(false);
        fetchList();
      });
  };

  return (
    <>
      <Tooltip title="Confirma asistencia del empleado a la obra">
        <Button type="primary" onClick={showLoading} size="small">
          CONFIRMAR ASISTENCIA
        </Button>
      </Tooltip>

      <Modal
        title={<p>CONFIRMAR ASISTENCIA</p>}
        footer={
          <>
            {rechazo ? (
              <Button type="primary" onClick={cancelar}>
                Cancelar
              </Button>
            ) : (
              <Button
                type="primary"
                style={{ background: "red" }}
                onClick={DespliegueOpciones}
              >
                No Asistencia
              </Button>
            )}
            {rechazo ? (
              <Button
                type="primary"
                style={{ background: "red" }}
                onClick={EnvioNoAsistencia}
                disabled={!motivoSeleccionado} // Se desactiva si no hay selección
              >
                Confirmar No Asistencia
              </Button>
            ) : (
              <Button type="primary" onClick={EnvioConfirmacion}>
                Confirmar Asistencia
              </Button>
            )}
          </>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={800}
      >
        <Row gutter={24}>
          <Col xs={24} sm={8} style={{ width: "100%" }}>
            <StyledFormItem label="Nombres" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.nombres} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={8} style={{ width: "100%" }}>
            <StyledFormItem label="Apellidos" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.apellidos} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={8} style={{ width: "100%" }}>
            <StyledFormItem label="Proyecto" labelCol={{ span: 24 }}>
              <Input
                allowClear
                disabled
                value={dataTicket?.descripcion_proyecto}
              />
            </StyledFormItem>
          </Col>

          {/* sleect de opciones de no asistrencia */}
          {rechazo ? (
            <Col xs={24} sm={12} style={{ width: "100%" }}>
              <StyledFormItem
                label="Motivo de no asistencia"
                labelCol={{ span: 24 }}
              >
                <Select
                  showSearch
                  options={OpcionesNoAsistencia}
                  value={motivoSeleccionado}
                  onChange={(value) => setMotivoSeleccionado(value)}
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
          ) : (
            ""
          )}

          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem label="Detalle" labelCol={{ span: 24 }}>
              <TextArea
                allowClear
                maxLength={255}
                value={confirmacion}
                placeholder="Escribe un detalle en caso de requerirlo"
                onChange={(e) => setConfirmacion(e.target.value)}
              />
            </StyledFormItem>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
