import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Select,
  Spin,
  Typography,
  notification,
  Space,
  Form,
  UploadProps,
  GetProp,
  UploadFile,
  Upload,
  SelectProps,
  Alert,
} from "antd";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { TkPreguntas, TkTicket } from "@/services/types";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import {
  crearTkTicket,
  crearTkTicketCalificacion,
  getTkCategoriasPadresTicket,
  getTkFarmacias,
  getTkFarmaciaUsuarios,
  getTkPreguntasDinamicas,
  getTkProcesosTicket,
  getTkTicket,
  getTkTicketPreguntas,
  getTkTicketSubCategoria,
} from "@/services/tickets/ticketsAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
import { TkEstrellas } from "../components/CalicacionEstrellas/TkEstrellas";
import TextArea from "antd/es/input/TextArea";
import { CustomUpload } from "../components/DatosBasicos/styled";

const { Text } = Typography;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface DataSelect {
  label: string | null;
  value: number | null;
}

export const FormCrearTickets = () => {
  const control = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<UploadFile>();
  const { getSessionVariable } = useSessionStorage();
  const idBodega = getSessionVariable(KEY_BODEGA);
  const [api, contextHolder] = notification.useNotification();

  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);
  const [tkTicket, setTkTicket] = useState<TkTicket>();
  const [selectCategorias, setSelectCategorias] = useState<DataSelect[]>([]);
  const [subcategorias, setSubcategorias] = useState<DataSelect[]>([]);
  const [subirArchivo, setSubirArchivo] = useState<boolean>(true);
  const [preguntas, setPreguntas] = useState<TkPreguntas[]>([]);
  const [preguntasDinamicas, setPreguntasDinamicas] = useState<DataSelect[]>(
    []
  );
  const [selectProcesos, setSelectProcesos] = useState<SelectProps["options"]>(
    []
  );
  const [idProceps, setIdProceps] = useState<string>("")
  const [selectFarmacia, setSelectFarmacia] = useState<SelectProps["options"]>(
    []
  );
  const [selectUsuariosFarmacias, setSelectUsuariosFarmacias] = useState<SelectProps["options"]>(
    []
  );

  //tomo id en editar, llamo al servicio y recupero
  useEffect(() => {
    if (id) {
      getTkTicket(id).then(({ data }) => {
        //guardo datos recuperados
        setTkTicket(data);
        setLoaderSave(false);
        setSubirArchivo(false);
      });
    } else {
      setLoaderSave(false);
    }
  }, [id]);

  useEffect(() => {
    //si hay datos seteo estos a los estados
    if (tkTicket) {
      control.setValue("categoria_id", tkTicket.categoria);
      control.setValue("subcategoria_id", tkTicket.subcategoria);
      control.setValue("detalle", tkTicket.detalle);
      control.setValue("numero_ticket", tkTicket.numero_ticket);
      control.setValue("autorizacion", tkTicket.autorizacion);
      fetchPreguntas();
      setLoaderEmp(false);
    } else {
      control.setValue("bodega_id", Number(idBodega));
      fectProcesos();
    }
  }, [tkTicket]);

  //servicio de procesos 1
  const fectProcesos = () => {
    getTkProcesosTicket().then(({ data: { data } }) => {
      const Procesos = data.map((item) => ({
        label: item.nombre_proceso,
        value: Number(item.id),
      }));

      setSelectProcesos(Procesos);
    });
  };

  //servicio de preguntas dinamicas
  const fetchPreguntasDInamicas = async (procesoId: number) => {
    if (!procesoId) {
      setPreguntasDinamicas([]);
      return;
    }
    try {
      const response = await getTkPreguntasDinamicas(procesoId);
      const categorias = response?.data?.data || [];

      // Mapear  los datos
      const nuevasPreguntas = categorias.map((item: any) => ({
        label: item.pregunta,
        value: Number(item.id),
      }));

      setPreguntasDinamicas(nuevasPreguntas);

      // Concatenar preguntas para el TextArea
      if (nuevasPreguntas.length > 0) {
        const preguntasTexto = nuevasPreguntas
          .map((p) => `- ${p.label}:`)
          .join("\n");
        control.setValue("detalle", preguntasTexto);
      } else {
        control.resetField("detalle");
      }
    } catch (error) {
      console.error(
        "Error al cargar preguntas dinámicas de esa subcategoría:",
        error
      );
    }
  };

  //llamado de categorias por id de proceso 2
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
        control.resetField("detalle");
        setSelectCategorias([]);
        setSubcategorias([]);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  //llamado de subcategorias por id de categoria 3
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

  //llamado de farmacias
  const fectFarmacia = () => {
    getTkFarmacias().then(({ data: { data } }) => {
      const Procesos = data.map((item) => ({
        label: item.bod_nombre,
        value: Number(item.id),
      }));

      setSelectFarmacia(Procesos);
    });
  };


  //llamado de usuarios por farmacias rol regente
  const fetchUsuariosFarmacias = async (prcoesoId: number) => {
    if (!prcoesoId) {
      setSelectUsuariosFarmacias([]);
      return;
    }
    try {
      const response = await getTkFarmaciaUsuarios(prcoesoId);
      const categorias = response?.data?.data || [];
      setSelectUsuariosFarmacias(
        categorias.map((item: any) => ({
          label: item.nombre,
          value: Number(item.id),
        }))
      );
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };



  const fetchPreguntas = () => {
    const idProceso = Number(tkTicket?.proceso_id);
    getTkTicketPreguntas(idProceso)
      .then((response) => {
        setPreguntas(
          response.data.data.map((pregunta) => ({
            id: pregunta.id,
            key: pregunta.id,
            pregunta: pregunta.pregunta,
            estado: pregunta.estado,
            tipo: pregunta.tipo,
            user_id: pregunta.user_id,
            proceso_id: pregunta.proceso_id,
            created_at: pregunta.created_at,
            nombre_crea: pregunta.nombre_crea,
          }))
        );
      })
      .catch((err) => {
        console.error("Error en la petición:", err.message);
      });
  };

  const pushNotification = ({
    type = "success",
    title,
    description,
  }: Notification) => {
    api[type]({
      message: title,
      description: description,
      placement: "bottomRight",
    });
  };

  const uploadProps: UploadProps = {
    maxCount: 1,
    accept: ".jpg, .jpeg, .png, .pdf, .xls, .xlsx, .docx",
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onRemove: () => {
      setFile(undefined); // Limpiar archivo al eliminarlo
    },
    beforeUpload: (file) => {
      // Asegurarse de que el archivo sea de un tipo válido
      const isValidType = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type);

      if (!isValidType) {
        notification.error({
          message: "Tipo de archivo no válido",
          description:
            "Por favor, suba una imagen, un archivo PDF, Excel o Word.",
        });
        return Upload.LIST_IGNORE; // Prevenir la carga del archivo
      }

      // Validación de tamaño de archivo (opcional)
      /* 
      const isSmallEnough = file.size <= 5 * 1024 * 1024; // 5MB
      if (!isSmallEnough) {
        notification.error({
          message: "Tamaño de archivo demasiado grande",
          description: "El archivo no debe exceder los 5MB.",
        });
        return Upload.LIST_IGNORE; // Prevenir la carga del archivo
      }
      */

      setFile(file); // Establecer el archivo en el estado
      return false; // Evitar la carga automática
    },
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);

    const formData = new FormData();
    formData.append("categoria_id", data.categoria_id);
    formData.append("subcategoria_id", data.subcategoria_id);
    formData.append("detalle", data.detalle);
    formData.append("bodega_id", data.bodega_id);

    if(idProceps == "7"){
      formData.append("farmacia_id", data.farmacia_id);
      formData.append("usuario_id", data.usuario_id);
    }

    // Asegúrate de que el archivo exista antes de agregarlo al FormData
    if (file) {
      formData.append("documento", file as FileType);
    }

    const respuestas = Object.entries(data)
      .filter(([key]) => key.startsWith("pregunta_"))
      .map(([key, value]) => ({
        pregunta_id: key.replace("pregunta_", ""),
        calificacion: value,
      }));

    // Enviar datos del formulario
    if (tkTicket) {
      crearTkTicketCalificacion({ ...data, respuestas })
        .then(() => {
          pushNotification({ title: "Calificación enviada con éxito!" });
          setTimeout(() => navigate(-1), 800);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.error,
            description: error.data,
          });
          setLoaderSave(false);
        });
    } else {
      crearTkTicket(formData)
        .then(() => {
          pushNotification({ title: "Ticket creado con éxito!" });
          setTimeout(() => navigate(-1), 800);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.error,
            description: error.message,
          });
          setLoaderSave(false);
        });
    }
  };

  return (
    <>
      {contextHolder}
      <Spin
        spinning={loaderSave}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
      >
        <Form
          layout="vertical"
          onFinish={control.handleSubmit(onFinish)}
          autoComplete="off"
        >
          <StyledCard
            title={
              tkTicket ? "Información del ticket, calificar" : "Crear ticket"
            }
            extra={
              <Space>
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<SaveOutlined />}
                >
                  {tkTicket ? "Confirmar calificación" : "Guardar"}
                </Button>
                <Link to={tkTicket ? "../.." : ".."} relative="path">
                  <Button danger type="primary" icon={<ArrowLeftOutlined />}>
                    Volver
                  </Button>
                </Link>
              </Space>
            }
          >
            {Object.keys(control.formState.errors).length > 0 && (
              <Text type="danger">
                Faltan campos por diligenciar o existen algunos errores
              </Text>
            )}
            <Row gutter={24}>
              {/* proceso */}
              {tkTicket ? (
                ""
              ) : (
                <Col xs={24} sm={8}>
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
                      <StyledFormItem required label="Proceso">
                        <Spin
                          spinning={loaderEmp}
                          indicator={<LoadingOutlined spin />}
                        >
                          <Select
                            {...field}
                            showSearch
                            allowClear
                            disabled={tkTicket ? true : false}
                            onSelect={(value) => {
                              control.resetField("subcategoria_id");
                              control.resetField("categoria_id");
                              control.resetField("detalle");
                              fetchCategorias(value);
                              setIdProceps("")
                              if(value === 8){
                                setIdProceps(value);
                                fectFarmacia();
                              }
                            }}
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                )
                            }
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            
                            options={selectProcesos}
                            status={error && "error"}
                          />
                        </Spin>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              )}

              <Col xs={24} sm={tkTicket ? 12 : 8}>
                <Controller
                  name="categoria_id"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "La categoría es requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Categoria">
                      <Spin
                        spinning={loaderEmp}
                        indicator={<LoadingOutlined spin />}
                      >
                        <Select
                          {...field}
                          showSearch
                          allowClear
                          options={selectCategorias}
                          disabled={!selectCategorias?.length}
                          onSelect={(value) => {
                            control.resetField("subcategoria_id");
                            control.resetField("detalle");
                            fetchSubcategorias(value);
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
                          status={error && "error"}
                        />
                      </Spin>
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>

              {/* Subcategoría */}
              <Col xs={24} sm={tkTicket ? 12 : 8}>
                <Controller
                  name="subcategoria_id"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "La subcategoría es requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Subcategoría">
                      <Spin
                        spinning={loaderEmp}
                        indicator={<LoadingOutlined spin />}
                      >
                        <Select
                          {...field}
                          showSearch
                          allowClear
                          options={subcategorias}
                          disabled={!subcategorias?.length}
                          onSelect={(value) => {
                            fetchPreguntasDInamicas(value);
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
                            subcategorias?.length
                              ? ""
                              : "NO HAY DATOS PARA ESTA CATEGORIA"
                          }
                          status={error && "error"}
                        />
                      </Spin>
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>

              {idProceps ? (
                <>
                  {/* farmacia */}
                  <Col xs={24} sm={12}>
                    <Controller
                      name="farmacia_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: idProceps ? true : false,
                          message: "La farmacia es requerida",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Farmacia">
                          <Spin
                            spinning={loaderEmp}
                            indicator={<LoadingOutlined spin />}
                          >
                            <Select
                              {...field}
                              showSearch
                              allowClear
                              disabled={tkTicket ? true : false}
                              onSelect={(value) => {
                                control.resetField("usuarios_id");
                                fetchUsuariosFarmacias(value);
                              }}
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .localeCompare(
                                    (optionB?.label ?? "")
                                      .toString()
                                      .toLowerCase()
                                  )
                              }
                              filterOption={(input, option) =>
                                (option?.label?.toString() ?? "")
                                  .toLowerCase()
                                  .includes(input.toString().toLowerCase())
                              }
                              options={selectFarmacia}
                              status={error && "error"}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>

                  {/* regente */}
                  <Col xs={24} sm={12}>
                    <Controller
                      name="usuario_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: idProceps ? true : false,
                          message: "El usuario es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Regente">
                          <Spin
                            spinning={loaderEmp}
                            indicator={<LoadingOutlined spin />}
                          >
                            <Select
                              {...field}
                              showSearch
                              allowClear
                              options={selectUsuariosFarmacias}
                              disabled={!selectUsuariosFarmacias?.length}
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .localeCompare(
                                    (optionB?.label ?? "")
                                      .toString()
                                      .toLowerCase()
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
                                  : "NO HAY DATOS PARA ESTA FARMACIA"
                              }
                              status={error && "error"}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </>
              ) : (
                ""
              )}

              {/* subir archivo */}
              {subirArchivo ? (
                <Col xs={24} sm={12}>
                  <Controller
                    control={control.control}
                    name="file"
                    render={({ fieldState: { error } }) => {
                      return (
                        <StyledFormItem label="Archivo:">
                          <CustomUpload {...uploadProps}>
                            <Button
                              block
                              ghost
                              type="primary"
                              icon={<UploadOutlined />}
                            >
                              Seleccionar archivo
                            </Button>
                          </CustomUpload>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      );
                    }}
                  />
                </Col>
              ) : (
                ""
              )}

              {/* Detalle */}
              <Col xs={24} sm={24}>
                <Controller
                  name="detalle"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "El detalle es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem
                      required
                      label="Información Detallada del Ticket"
                    >
                      <TextArea
                        {...field}
                        maxLength={994}
                        rows={preguntasDinamicas?.length > 0 ? 10 : 4}
                        autoSize
                        status={error && "error"}
                        style={{ textTransform: "none" }}
                        disabled={tkTicket ? true : false}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>

              {id ? (
                <div
                  style={{
                    margin: "50px 30%",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Alert
                    message="Responda las siguientes preguntas para finalizar el ticket."
                    type="success"
                  />
                </div>
              ) : (
                ""
              )}

              {/* Preguntas de calificación */}
              {preguntas.map((pregunta) => (
                <Col xs={24} sm={8} key={pregunta.key}>
                  <StyledFormItem required label={pregunta.pregunta}>
                    <TkEstrellas
                      name={`pregunta_${pregunta.key}`}
                      control={control.control}
                    />
                  </StyledFormItem>
                </Col>
              ))}
            </Row>
          </StyledCard>
        </Form>
      </Spin>
    </>
  );
};
