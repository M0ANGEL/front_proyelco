import {
  AnularTkTicket,
  editarTicketObservacion,
  getTkCategoriasPadresTicket,
  getTkProcesosTicket,
  getTkTicketSubCategoria,
  NoConfermeGestio,
} from "@/services/tickets/ticketsAPI";
import {
  Button,
  Col,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tooltip,
  Typography,
  Upload,
  message,
  notification,
} from "antd";
import type {
  GetProp,
  PopconfirmProps,
  SelectProps,
  UploadFile,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import { Link } from "react-router-dom";
import { DataId } from "../../ListCrearTickts/types";
import { GrView } from "react-icons/gr";
import { TiStarFullOutline } from "react-icons/ti";
import { CustomUpload } from "../DatosBasicos/styled";
import { UploadOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";

interface DataSelect {
  label: string | null;
  value: number | null;
}

const { Text } = Typography;

export const TicketModalEstado = ({
  ticket,
  fetchList,
  pushNotification,
}: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const control = useForm();
  const { watch } = useForm();

  const [motivoCancelacion, setMotivoCancelacion] = useState<string>(""); //campo donde guardo lo escrito
  const [motivoInconformidad, setMotivoInconformidad] = useState<string>(""); //campo donde guardo lo escrito
  const [BotonAutoAnular, setBotonAutoAnular] = useState<boolean>(false);
  const [Anulado, setAnulado] = useState<boolean>(false);
  const [Calificacion, setCalificacion] = useState<boolean>(false);
  const [cierreTciket, setCierreTciket] = useState<boolean>(false);
  const [butonInconformidad, setButonInconformidad] = useState<boolean>(false);
  const [cargar, setcargar] = useState<boolean>(false);
  const [editarDetalle, setEditarDetalle] = useState<string>(ticket.detalle); //campo donde guardo lo escrito
  const [file, setFile] = useState<UploadFile>();
  const [selectProcesos, setSelectProcesos] = useState<SelectProps["options"]>(
    []
  );
  const [selectCategorias, setSelectCategorias] = useState<DataSelect[]>([]);
  const [subcategorias, setSubcategorias] = useState<DataSelect[]>([]);
  const [categoria_id, setcategoria_id] = useState<string>("");
  const [subcategoria_id, setsubcategoria_id] = useState<string>("");

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  useEffect(() => {
    LlamadoTikectsId();
  }, []);

  //llamado por id los ticj¿kets
  const LlamadoTikectsId = () => {
    if (ticket.estado !== "Creado") {
      setAnulado(true);
    }

    if (ticket.usuarioAsignado !== null) {
      setAnulado(true);
    }

    if (ticket.estado === "Realizado") {
      setCalificacion(true);
    }
  };

  //confirmarcion de gestion del ticket
  const confirm: PopconfirmProps["onConfirm"] = () => {
    message.success("Gestion Confirmada");
    setCierreTciket(true);
    setBotonAutoAnular(false);
  };

  const cancel: PopconfirmProps["onCancel"] = () => {
    message.error("Inconformidad en gestion");
    setCierreTciket(false);
    setCalificacion(false);
    setButonInconformidad(true);
  };

  //envio de inconformidad al cerrar el ticket
  const EnvioIncorfimadagestion = () => {
    setcargar(true);
    const AnulacionTicket = {
      id: Number(ticket.id),
      motivo_cancelacion: motivoInconformidad,
    };

    NoConfermeGestio(AnulacionTicket, ticket.id)
      .then(() => {
        pushNotification({
          title: "Ticket fue anulado exitosamente",
          type: "success",
        });
      })
      .catch((err) => {
        pushNotification({
          title: `Error al anular el ticket, ya esta en gestión ${err}`,
          type: "error",
        });
      })
      .finally(() => {
        fetchList();
        setOpen(false);
        setcargar(false);
        setBotonAutoAnular(false);
        setAnulado(true);
      });
  };

  const showLoading = () => {
    setEditarDetalle(ticket.detalle);
    setOpen(true);
    fectProcesos();
    precargaSelect();
  };

  //estados para botones de anulacion
  const AutoCancelacion = () => {
    setBotonAutoAnular(true);
  };

  //envio de autocancelacion de ticket
  const EnvioCancelacion = () => {
    setcargar(true);
    const AnulacionTicket = {
      id: Number(ticket.id),
      motivo_cancelacion: motivoCancelacion,
    };

    AnularTkTicket(AnulacionTicket, ticket.id)
      .then(() => {
        pushNotification({
          title: "Ticket fue anulado exitosamente",
          type: "success",
        });
      })
      .catch((err) => {
        pushNotification({
          title: `Error al anular el ticket, ya esta en gestión ${err}`,
          type: "error",
        });
      })
      .finally(() => {
        setOpen(false);
        setcargar(false);
        setBotonAutoAnular(false);
        setAnulado(true);
        fetchList();
      });
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

  //servicio de cambio de proceso
  const fectProcesos = () => {
    getTkProcesosTicket().then(({ data: { data } }) => {
      const Procesos = data.map((item) => ({
        label: item.nombre_proceso,
        value: Number(item.id),
      }));

      setSelectProcesos(Procesos);
    });
  };

  //servicio de cambio de categoria
  const fetchCategorias = async (prcoesoId: number) => {
    if (!prcoesoId) {
      setSelectCategorias([]);
      return;
    }
    try {
      const response = await getTkCategoriasPadresTicket(prcoesoId);
      const categorias = response?.data?.data || [];
      setSelectCategorias(
        categorias.map((item: any) => ({
          label: item.name,
          value: Number(item.id),
        }))
      );

      if (categorias?.length === 0) {
        control.resetField("subcategoria_id");
        control.resetField("categoria_id");
        setSelectCategorias([]);
        setSubcategorias([]);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  //servicio de cambio de subcategoria
  const fetchSubcategorias = async (categoriaId: number) => {
    if (!categoriaId) {
      setSubcategorias([]);
      return;
    }
    try {
      const response = await getTkTicketSubCategoria(categoriaId);
      const subcategorias = response?.data?.data || [];
      setSubcategorias(
        subcategorias.map((item) => ({
          label: item.name,
          value: Number(item.id),
        }))
      );
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
    }
  };

  const precargaSelect = () => {
    if (ticket) {
      // Setear el proceso inicial
      control.setValue("proceso", Number(ticket.proceso_id));
      fetchCategorias(Number(ticket.proceso_id));

      // Setear la categoría inicial
      control.setValue("categoria_id", Number(ticket.categoria_id));
      fetchSubcategorias(Number(ticket.categoria_id));

      // Setear la subcategoría inicsial
      control.setValue("subcategoria_id", Number(ticket.subcategoria_id));
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();

    if (editarDetalle.trim()) {
      formData.append("detalle", editarDetalle);
    }

    if (categoria_id) {
      formData.append("categoria_id", categoria_id.toString());
    }

    if (subcategoria_id) {
      formData.append("subcategoria_id", subcategoria_id.toString());
    }

    if (file) {
      formData.append("documento", file as FileType);
    }

    // Si no hay datos para enviar, no ejecutar la petición
    if (!file && !editarDetalle.trim() && !categoria_id && !subcategoria_id) {
      notification.warning({
        message: "Nada que enviar",
        description: "No hay datos o archivos para subir.",
      });
      return;
    }

    try {
      await editarTicketObservacion(Number(ticket.id), formData);
      pushNotification({
        title: "Ticket actualizado con éxito!",
        type: "success",
      });

      // Limpiar el estado después de la subida
      setEditarDetalle("");
      setFile(undefined);
      fetchList();
      setOpen(false);
    } catch (error) {
      pushNotification({
        title: `Error al editar el detalle, ${error}`,
        type: "error",
      });
    }
  };

  return (
    <>
      <Tooltip title={Calificacion ? "Pendiente Calificar" : "Ver Ticket"}>
        <Button
          size="small"
          type="primary"
          onClick={showLoading}
          disabled={cargar}
        >
          {Calificacion ? <TiStarFullOutline /> : <GrView />}
        </Button>
      </Tooltip>

      <Modal
        title={
          <p>
            INFORMACION DEL TICKET{" "}
            <span style={{ color: "#23840d" }}>{ticket?.numero_ticket}</span>{" "}
          </p>
        }
        footer={
          <>
            <Button type="primary" disabled={Anulado} onClick={handleUpload}>
              Editar Ticket
            </Button>
            {BotonAutoAnular ? (
              <Button
                type="primary"
                disabled={!motivoCancelacion}
                onClick={EnvioCancelacion}
              >
                Confirmar Cancelacion
              </Button>
            ) : (
              <Button
                type="primary"
                disabled={Anulado}
                onClick={AutoCancelacion}
              >
                Auto Cancelar
              </Button>
            )}

            <Link to={`../edit/${ticket?.id}`}>
              <Button
                disabled={!cierreTciket}
                type="primary"
                style={{ marginLeft: "10px" }}
              >
                Calificar
              </Button>
            </Link>

            {Calificacion ? (
              <Popconfirm
                title="Confirmar gestion"
                description="Estas conforme con la gestion del cierre del ticket?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Si"
                cancelText="No"
              >
                <Button
                  disabled={cierreTciket}
                  style={{
                    marginLeft: "5px",
                    background: cierreTciket ? "#87aa72" : "#229622",
                    color: "white",
                  }}
                >
                  Confirmar gestion del Ticket
                </Button>
              </Popconfirm>
            ) : (
              ""
            )}

            {butonInconformidad ? (
              <Button
                style={{
                  marginLeft: "5px",
                  background: cierreTciket ? "#87aa72" : "#229622",
                  color: "white",
                }}
                onClick={EnvioIncorfimadagestion}
              >
                Enviar inconformidad
              </Button>
            ) : (
              ""
            )}
          </>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setButonInconformidad(false);
          if (ticket.estado === "Realizado") {
            setCalificacion(true);
          }
          setBotonAutoAnular(false);
        }}
        width={800}
      >
        <Row gutter={24}>
          {/* proceso */}
          <Col xs={24} sm={8} style={{ width: "100%" }}>
            <Controller
              name="proceso"
              control={control.control}
              rules={{
                required: {
                  value: false,
                  message: "El proceso es requerida",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem
                  required
                  label="Proceso"
                  labelCol={{ span: 24 }}
                >
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    disabled={Anulado}
                    onSelect={(value) => {
                      control.resetField("subcategoria_id");
                      control.resetField("categoria_id");
                      fetchCategorias(value);
                    }}
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
                    options={selectProcesos}
                  />{" "}
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>

          {/* categoria */}
          <Col xs={24} sm={8} style={{ width: "100%" }}>
            <Controller
              name="categoria_id"
              control={control.control}
              rules={{
                required: {
                  value: false,
                  message: "El proceso es requerida",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem
                  required
                  label="Categoria"
                  labelCol={{ span: 24 }}
                >
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    disabled={Anulado || !selectCategorias?.length}
                    options={selectCategorias}
                    onSelect={(value) => {
                      control.resetField("subcategoria_id");
                      fetchSubcategorias(value);
                      setcategoria_id(value);
                    }}
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
                    placeholder={
                      selectCategorias?.length
                        ? ""
                        : "NO HAY DATOS PARA ESTE PROCESO"
                    }
                  />
                </StyledFormItem>
              )}
            />
          </Col>

          {/* subcategoria */}
          <Col xs={24} sm={8} style={{ width: "100%" }}>
            <Controller
              name="subcategoria_id"
              control={control.control}
              rules={{
                required: {
                  value: false,
                  message: "El proceso es requerida",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem
                  required
                  label="Subcategoria"
                  labelCol={{ span: 24 }}
                >
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    disabled={Anulado || !subcategorias?.length}
                    options={subcategorias}
                    onSelect={(value) => {
                      setsubcategoria_id(value);
                    }}
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
                    placeholder={
                      selectCategorias?.length
                        ? ""
                        : "NO HAY DATOS PARA ESTE PROCESO"
                    }
                  />
                </StyledFormItem>
              )}
            />
          </Col>

          {/* detalle del ticket */}
          <Col xs={24} style={{ marginTop: "15px", marginBottom: "15px" }}>
            <h4 style={{ textAlign: "center" }}>Detalle del ticket</h4>
            <TextArea
              allowClear
              disabled={Anulado}
              maxLength={994}
              autoSize
              style={{ textTransform: "uppercase" }}
              value={editarDetalle}
              onChange={(e) => setEditarDetalle(e.target.value.toUpperCase())}
            />
          </Col>

          {/* subida de archivo */}
          <Col xs={24} sm={12}>
            <StyledFormItem>
              <CustomUpload {...uploadProps}>
                <Button
                  block
                  ghost
                  type="primary"
                  disabled={Anulado}
                  icon={<UploadOutlined />}
                >
                  Seleccionar archivo
                </Button>
              </CustomUpload>
            </StyledFormItem>
          </Col>

          {/* respuesta de autorizacion del ticket */}
          {ticket?.respuesta_autorizacion ? (
            <div style={{ width: "100%", marginTop: "15px" }}>
              <h4 style={{ textAlign: "center" }}>
                Observacion de autorizacion
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  disabled
                  autoSize
                  value={ticket?.respuesta_autorizacion}
                />
              </Col>
            </div>
          ) : (
            ""
          )}

          {/* respuesta de gestion del ticket */}
          {ticket?.rechazo ? (
            <div style={{ width: "100%", marginTop: "15px" }}>
              <h4 style={{ textAlign: "center" }}>
                Observacion de cierre del ticket
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  disabled
                  autoSize
                  value={ticket?.rechazo}
                />
              </Col>
            </div>
          ) : (
            ""
          )}

          {/* campo para responder  auto anulacion*/}
          {BotonAutoAnular ? (
            <div style={{ width: "100%", marginTop: "20px" }}>
              <h4 style={{ color: "red", textAlign: "center" }}>
                Motivo de anulación
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  required
                  name="motivo_cancelacion"
                  maxLength={255}
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                />
              </Col>
            </div>
          ) : (
            ""
          )}

          {/* campo para responder  inconformidad*/}
          {butonInconformidad ? (
            <div style={{ width: "100%", marginTop: "20px" }}>
              <h4 style={{ color: "red", textAlign: "center" }}>
                Envio de Inconformidad
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  required
                  name="motivo_cancelacion"
                  maxLength={255}
                  value={motivoInconformidad}
                  onChange={(e) => setMotivoInconformidad(e.target.value)}
                />
              </Col>
            </div>
          ) : (
            ""
          )}
        </Row>
      </Modal>
    </>
  );
};
