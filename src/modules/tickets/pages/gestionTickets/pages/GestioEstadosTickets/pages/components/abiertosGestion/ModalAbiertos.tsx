import {
  Button,
  Col,
  GetProp,
  Input,
  Modal,
  notification,
  Row,
  Spin,
  Tooltip,
  UploadFile,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import {
  CerrarTkTicket,
  GestionarTkTicket,
  RechazoGestionTkTicket,
} from "@/services/tickets/administracionAPI";
import { UploadOutlined } from "@ant-design/icons";
import { GoAlertFill } from "react-icons/go";
import { RxResume } from "react-icons/rx";
import { GrView } from "react-icons/gr";
import { CustomUpload } from "@/modules/common/components/FormDocuments/styled";

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
  farmacia: string;
  puntosTicket: string;
}

export const ModalAbiertos = ({
  fetchList,
  pushNotification,
  dataTicket,
}: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const [ticketGstion, setTicketGstion] = useState<boolean>(false);
  const [respuestaCirreTicket, setRespuestaCirreTicket] = useState<string>("");
  const [autorizacionRequiere, setautorizacionRequiere] =
    useState<boolean>(false);
  const [respuestaRechazoTicket, setRespuestaRechazoTicket] =
    useState<string>("");
  const [buttonRechazo, setbuttonRechazo] = useState<boolean>(false);
  const [estadoAutorizacion, setEstadoAutorizacion] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<UploadFile>();

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  useEffect(() => {
    if (dataTicket.autorizacion == "Creado") {
      setautorizacionRequiere(true);
    }
    if (dataTicket.estado == "Gestion") {
      setTicketGstion(true);
    }
    if (dataTicket.autorizacion == "1") {
      setEstadoAutorizacion(true);
    }
  }, [dataTicket]);

  //show
  const showLoading = () => {
    setOpen(true);
  };
  //gestiornar ticket para realizar
  const gestionTicket = () => {
    const cierreTicke = { id: dataTicket.id };
    GestionarTkTicket(cierreTicke, dataTicket.id)
      .then(() => {
        setOpen(false);
        setbuttonRechazo(false);
        pushNotification({
          title: "Ticket gestionado correctamente",
          type: "success",
        }),
          400;
      })
      .catch((err) => {
        setOpen(false);
        pushNotification({
          title: `Error: ${err.response.data.data}`,
          type: "error",
        });
      })
      .finally(() => {
        fetchList();
        /* LlamadoTikectsId(); */
      });
  };

  //liberar ticket
  const LiberarTicket = () => {
    const cierreTicke = { id: dataTicket.id };
    GestionarTkTicket(cierreTicke, dataTicket.id)
      .then(() => {
        pushNotification({
          title: "Ticket liberado",
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
        setOpen(false);
        setTicketGstion(false);
        setRespuestaCirreTicket("");
        fetchList();
      });
  };

  //envio de liberacion de ticket
  const RechazarTicketButton = () => {
    setbuttonRechazo(true);
    setTicketGstion(false);
  };

  //refutar que no se puede dar gestion
  const RechazarTicket = () => {
    const rechazoTicket = {
      id: dataTicket.id,
      rechazo: respuestaRechazoTicket,
    };
    RechazoGestionTkTicket(rechazoTicket, dataTicket.id)
      .then(() => {
        pushNotification({
          title: "Peticion de soltar gestion, enviada exitosamente",
          type: "success",
        });
      })
      .catch((err) => {
        pushNotification({
          title: `Error al soltar ticket: ${err.message}`,
          type: "error",
        }),
          400;
      })
      .finally(() => {
        setOpen(false);
        fetchList();
      });
  };

  //retorno de boton
  const buttonRetorno = () => {
    if (dataTicket?.estado == "Inconforme de Gestion") {
      return (
        <Tooltip title="Inconformidad en la gestion">
          <Button type="primary" size="small" onClick={showLoading}>
            <GoAlertFill />
          </Button>
        </Tooltip>
      );
    }
    if (dataTicket?.userSoluciona_id == dataTicket?.idLogueado) {
      return (
        <Button
          type="primary"
          style={{ background: "#1638a2" }}
          onClick={showLoading}
          size="small"
        >
          <RxResume />
        </Button>
      );
    } else if (dataTicket?.userSoluciona_id == null) {
      return (
        <Button type="primary" onClick={showLoading} size="small">
          <GrView />
        </Button>
      );
    }
  };

  //subida de archivo en editar al observacion
  const uploadProps: UploadProps = {
    maxCount: 1,
    accept: ".jpg, .jpeg, .png, .pdf, .xls, .xlsx",
    progress: {
      strokeColor: { "0%": "#108ee9", "100%": "#87d068" },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onRemove: () => setFile(undefined),
    beforeUpload: (file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(file.type)) {
        notification.error({
          message: "Tipo de archivo no válido",
          description:
            "Por favor, suba una imagen, un archivo PDF o un archivo Excel.",
        });
        return Upload.LIST_IGNORE;
      }

      setFile(file);
      return false; // Evita la carga automática
    },
  };

  //cierre del ticket
  const EnvioCierreTicket = async () => {
    setLoading(true);

    const formData = new FormData();

    if (respuestaCirreTicket.trim()) {
      formData.append("rechazo", respuestaCirreTicket.toString());
    }

    if (file) {
      formData.append("documento", file as FileType);
    }

    try {
      await CerrarTkTicket(Number(dataTicket.id), formData);
      pushNotification({
        title: "Ticket cerrado exitosamente",
        type: "success",
      });

      setOpen(false);
      setLoading(false);
      fetchList();
    } catch (error) {
      pushNotification({
        title: `Error al cerrar ticket: ${error}`,
        type: "error",
      });
    }
  };
  //jsx
  return (
    <>
      {buttonRetorno()}
      <Modal
        title={
          <>
            <p>
              INFORMACION DEL TICKET{" "}
              <span style={{ color: "#23840d" }}>
                {dataTicket?.numero_ticket}
              </span>{" "}
            </p>
            <p>
              STORY POINTS{" "}
              <span style={{ color: "#23840d" }}>
                {dataTicket?.puntosTicket}
              </span>{" "}
            </p>
          </>
        }
        footer={
          <>
            {dataTicket.farmacia == "1" ? ( //validar si el ticket fue creado para farmacia, ellos no pueden rechazar la gestion
              ""
            ) : (
              <>
                {buttonRechazo ? (
                  <Button
                    style={{ background: "#ef4b4b" }}
                    type="primary"
                    onClick={RechazarTicket}
                    disabled={!respuestaRechazoTicket}
                  >
                    Confirmar Rechazo de la gestio ticket
                  </Button>
                ) : (
                  <Button
                    style={{
                      background: ticketGstion ? "#e57878" : "red",
                      color: "white",
                    }}
                    type="primary"
                    onClick={RechazarTicketButton}
                    disabled={ticketGstion}
                  >
                    {ticketGstion
                      ? "Liberar para rechazar"
                      : "Rechazar gestion del  ticket"}
                  </Button>
                )}
              </>
            )}

            {ticketGstion ? (
              <Button
                style={{ background: "#19796b" }}
                type="primary"
                onClick={LiberarTicket}
              >
                Liberar ticket
              </Button>
            ) : (
              ""
            )}

            {ticketGstion ? (
              <Button
                type="primary"
                disabled={autorizacionRequiere ? true : !respuestaCirreTicket}
                style={{ color: autorizacionRequiere ? "#403f3f" : "" }}
                onClick={EnvioCierreTicket}
              >
                {autorizacionRequiere ? "Sin autorizar" : "Cerrar ticket"}
              </Button>
            ) : (
              <Button
                type="primary"
                disabled={estadoAutorizacion}
                onClick={gestionTicket}
              >
                {estadoAutorizacion
                  ? "Pendiente Autorizacion"
                  : "Gestionar ticket"}
              </Button>
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
                rows={3}
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

          <div style={{ marginTop: 10, width: "100%" }}>
            <Col xs={24} sm={12}>
              <StyledFormItem>
                <CustomUpload {...uploadProps}>
                  <Button block ghost type="primary" icon={<UploadOutlined />}>
                    Seleccionar archivo para respuesta del ticket
                  </Button>
                </CustomUpload>
              </StyledFormItem>
            </Col>
          </div>

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
                  autoSize
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
                  placeholder="Escribe el motivo del rechazo de la gestion del ticket"
                  maxLength={210}
                  value={respuestaRechazoTicket}
                  onChange={(e) => setRespuestaRechazoTicket(e.target.value)}
                />
              </Col>
            </div>
          ) : (
            ""
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
          <p style={{ marginTop: "10px" }}>Procesando Gestion...</p>
        </div>
      </Modal>
    </>
  );
};
