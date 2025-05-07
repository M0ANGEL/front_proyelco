import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  SelectProps,
  Spin,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import {
  AsignarTkTicket,
  estadoValidacion,
  RechazoTkTicket,
} from "@/services/tickets/administracionAPI";
import { AiFillEye } from "react-icons/ai";
import { TkUsers } from "@/services/types";

// Interfaces
interface DataId {
  fetchList: () => void;
  pushNotification: (message: { title: string; type?: string }) => void;
  dataTicket: DataTypeA;
  dataUsuarios: TkUsers[];
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
  puntosTicket: string;
  proceso_id: string;
  vencido: boolean;
  usuarioAsignado: string | null;
}

export const ModalAbiertos = ({
  fetchList,
  pushNotification,
  dataTicket,
  dataUsuarios,
}: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const [ticketGstion, setTicketGstion] = useState<boolean>(false);
  const [respuestaCirreTicket, setRespuestaCirreTicket] = useState<string>("");
  // const [autorizacionRequiere, setautorizacionRequiere] =
  //   useState<boolean>(false);
  const [respuestaRechazoTicket, setRespuestaRechazoTicket] =
    useState<string>("");
  const [buttonRechazo, setbuttonRechazo] = useState<boolean>(false);
  //usuarios para asignar
  const [selectUsuarios, setSelectUsuarios] = useState<SelectProps["options"]>(
    []
  );
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(
    null
  ); // Estado para almacenar el usuario seleccionado
  const [asignar, setAsignar] = useState<boolean>(false); // Estado para almacenar el usuario seleccionado
  const [puntos, setPuntos] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  //show
  const showLoading = () => {
    UsuariosAsignarServicio();
    setOpen(true);
  };

  //envio de liberacion de ticket
  const RechazarTicketButton = () => {
    setbuttonRechazo(true);
    setTicketGstion(false);
  };

  //cierre del ticket
  const RechazarTicket = () => {
    const rechazoTicket = {
      id: dataTicket.id,
      rechazo: respuestaRechazoTicket,
    };
    RechazoTkTicket(rechazoTicket, dataTicket.id)
      .then(() => {
        pushNotification({
          title: "Ticket rechazo exitosamente",
          type: "success",
        });
      })
      .catch((err) => {
        pushNotification({
          title: `Error al cerrar ticket: ${err.message}`,
          type: "error",
        }),
          400;
      })
      .finally(() => {
        setOpen(false);
        fetchList();
        /* LlamadoTikectsId(); */
      });
  };

  useEffect(() => {
    if (dataTicket.usuarioAsignado !== null) {
      setAsignar(true);
    }
  }, [dataTicket]);

  //asignacion de usuario
  const UsuariosAsignarServicio = () => {
    const usuarios = dataUsuarios.map((item: TkUsers) => ({
      label: item.nombre,
      value: Number(item.id),
    }));
    setSelectUsuarios(usuarios);
  };

  // Asignar ticket
  const AsinamientoTicket = () => {
    if (!usuarioSeleccionado) {
      pushNotification({
        title: "Por favor, seleccione un usuario.",
        type: "warning",
      });
      return;
    }

    const asignacionData = {
      id: dataTicket.id,
      puntosTicket: puntos,
      my_ticketsgestion_id: usuarioSeleccionado,
    };

    AsignarTkTicket(asignacionData)
      .then(() => {
        pushNotification({
          title: "Ticket Asignado ",
          type: "info",
        });
      })
      .catch((err) => {
        pushNotification({
          title: `Error: ${err.message}, El ticket no se puede asignar, acualmente ya esta asignado`,
          type: "error",
        });
      })
      .finally(() => {
        setOpen(false);
        fetchList();
      });
  };

  // Asignar ticket
  const EstadoValidacion = () => {
    setLoading(true);
    estadoValidacion(dataTicket.id)
      .then(() => {
        pushNotification({
          title: "Cambio de estado en validacion",
          type: "info",
        });
      })
      .catch((err) => {
        pushNotification({
          title: `Error: ${err.message}`,
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
        setOpen(false);
        fetchList();
      });
  };

  //retorno de boton
  const buttonRetorno = () => {
    return (
      <Tooltip
        title={
          dataTicket.vencido
            ? "Administrar Ticket | vencido"
            : "Administrar Ticket"
        }
      >
        <Button type="primary" onClick={showLoading} size="small">
          <AiFillEye />
        </Button>
      </Tooltip>
    );
  };

  //jsx
  return (
    <>
      {buttonRetorno()}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <p>
              INFORMACION DEL TICKET{" "}
              <span style={{ color: "#23840d" }}>
                {dataTicket?.numero_ticket}
              </span>
            </p>
            {dataTicket?.puntosTicket && (
              <p>
                STORY POINTS{" "}
                <span style={{ color: "#23840d" }}>
                  {dataTicket?.puntosTicket}
                </span>
              </p>
            )}
          </div>
        }
        footer={
          <>
            {dataTicket?.usuarioAsignado !== null ? null : dataTicket.estado ===
                "Creado" || dataTicket.estado === "Gestion Rechazada" ? (
              <Button
                style={{
                  background: "blue",
                  color: "white",
                }}
                type="primary"
                onClick={EstadoValidacion}
                disabled={ticketGstion}
              >
                Entrar en validación
              </Button>
            ) : (
              <Button
                style={{
                  background: "blue",
                  color: "white",
                }}
                type="primary"
                onClick={EstadoValidacion}
                disabled={ticketGstion}
              >
                Salir de validación
              </Button>
            )}

            {dataTicket?.usuarioAsignado == null ? (
              <Tooltip
                title={
                  asignar ||
                  dataTicket.autorizacion === "3" ||
                  dataTicket.autorizacion === "1"
                    ? "Ticket Asignado, sin autorizar o la autorización fue rechazada"
                    : "Asignar Ticket"
                }
              >
                <Button
                  type="primary"
                  onClick={AsinamientoTicket}
                  disabled={
                    asignar ||
                    dataTicket.autorizacion === "3" ||
                    dataTicket.autorizacion === "1" ||
                    dataTicket.estado === "En validacion" ||
                    (dataTicket.proceso_id === "2" && puntos.trim() === "")
                  }
                >
                  Asignar ticket
                </Button>
              </Tooltip>
            ) : (
              ""
            )}
            {dataTicket?.usuarioAsignado == null ? (
              buttonRechazo ? (
                <Button
                  style={{ background: "#ef4b4b" }}
                  type="primary"
                  onClick={RechazarTicket}
                  disabled={!respuestaRechazoTicket}
                >
                  Confirmar Rechazo del ticket
                </Button>
              ) : (
                <Button
                  style={{
                    background: ticketGstion ? "#e57878" : "red",
                    color: "white",
                  }}
                  type="primary"
                  onClick={RechazarTicketButton}
                  disabled={
                    ticketGstion || dataTicket.estado == "En validacion"
                  }
                >
                  Rechazar ticket
                </Button>
              )
            ) : (
              <span style={{ color: "red" }}>
                <b>
                  El ticket esta asignado, se debe liberar para rechazar y poder
                  asignar de nuevo
                </b>
              </span>
            )}
          </>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setbuttonRechazo(false);
        }}
        width={800}
      >
        <Row gutter={24}>
          {/* Campo de Categoría Padre */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Categoría Padre" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.categoria} />
            </StyledFormItem>
          </Col>

          {/* campo subcategoria */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Subcategoria" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.subcategoria} />
            </StyledFormItem>
          </Col>

          {/* motivo de ticket */}
          <div
            style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
          >
            <h4 style={{ textAlign: "center" }}>Detalle del ticket</h4>
            <Col xs={24} sm={24}>
              <TextArea
                allowClear
                disabled
                autoSize
                value={dataTicket?.detalle}
              />
            </Col>
          </div>

          {/* fecha de solicitud */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Fecha de creacion" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.created_at} />
            </StyledFormItem>
          </Col>

          {/* bodega de quien solicita */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Bodega Solicita" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.bodega} />
            </StyledFormItem>
          </Col>

          {/* usuario que solicita */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Usuario Solicita" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.creador_ticket} />
            </StyledFormItem>
          </Col>

          {/* usuario que solicita proceso*/}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Proceso" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.nombre_proceso} />
            </StyledFormItem>
          </Col>

          {/* respuesta de autorizacion del ticket */}
          {dataTicket?.respuesta_autorizacion ? (
            <div
              style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
            >
              <h4 style={{ textAlign: "center" }}>
                Observacion de autorizacion
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  disabled
                  rows={3}
                  value={dataTicket?.respuesta_autorizacion}
                />
              </Col>
            </div>
          ) : (
            ""
          )}

          {/* campo de dato de respuesta  gestion*/}
          {ticketGstion && (
            <div
              style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
            >
              <h4 style={{ textAlign: "center" }}>
                Detalle del cierre del ticket
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  required
                  name="respuesta_autorizacion"
                  maxLength={1000}
                  rows={5}
                  value={respuestaCirreTicket}
                  onChange={(e) => setRespuestaCirreTicket(e.target.value)}
                />
              </Col>
            </div>
          )}

          {/* campo de dato de rechazo del ticket  */}
          {buttonRechazo ? (
            <div
              style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
            >
              <h4 style={{ textAlign: "center" }}>
                Motivo del rechazo del ticket
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  required
                  name="rechazo"
                  placeholder="Escribe el motivo para poder rechazar el ticket"
                  maxLength={970}
                  rows={5}
                  value={respuestaRechazoTicket}
                  onChange={(e) => setRespuestaRechazoTicket(e.target.value)}
                />
              </Col>
            </div>
          ) : (
            ""
          )}

          {["Creado", "Gestion Rechazada"].includes(dataTicket?.estado) ? (
            <>
              <Col
                xs={24}
                sm={18}
                style={{
                  width: "100%",
                  display:
                    asignar || dataTicket?.autorizacion === "3"
                      ? "none"
                      : "block",
                  marginTop: "33px",
                }}
              >
                <StyledFormItem required>
                  <Select
                    showSearch
                    options={selectUsuarios}
                    onChange={(value) => setUsuarioSeleccionado(value)}
                    placeholder="Seleccione un usuario"
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() || "").includes(
                        input.toLowerCase()
                      )
                    }
                  />
                </StyledFormItem>
              </Col>

              {/* Campo de Puntos */}
              <Col
                xs={24}
                sm={6}
                style={{
                  width: "100%",
                  display:
                    asignar || dataTicket?.autorizacion === "3"
                      ? "none"
                      : "block",
                }}
              >
                <StyledFormItem
                  label="Story Points"
                  labelCol={{ span: 24 }}
                  validateStatus={
                    dataTicket?.proceso_id === "2" && !puntos ? "error" : ""
                  }
                  help={
                    dataTicket?.proceso_id === "2" && !puntos
                      ? "Este campo es obligatorio para proceso desarrollo"
                      : ""
                  }
                >
                  <Input
                    placeholder="98"
                    maxLength={3}
                    value={puntos}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setPuntos(value);
                    }}
                    required={dataTicket?.proceso_id === "2"}
                  />
                </StyledFormItem>
              </Col>
            </>
          ) : (
            <h4>
              Salir de estado de validación para poder asignar o rechazar el
              ticket.
            </h4>
          )}
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
          <p style={{ marginTop: "10px" }}>Procesando Estado...</p>
        </div>
      </Modal>
    </>
  );
};
