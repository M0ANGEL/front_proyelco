/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  DatosBasicos,
  DatosConfigProyecto,
  DatosFacturacion,
} from "../../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Proyectos } from "@/services/types";
import {
  getIngenieros,
  getProcesosProyectos,
  getTipoProyectos,
  getUsersProyecto,
  getUsuariosCorreo,
} from "@/services/salud/conveniosTipoAPI";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  SelectProps,
  Typography,
  Button,
  Space,
  Form,
  Spin,
  Tabs,
  notification,
} from "antd";
import {
  crearProyecto,
  getProyectoID,
  updateProyecto,
} from "@/services/proyectos/proyectosAPI";

const { Text } = Typography;

export const FormConvenios = () => {
  const [selectTipoProyecto, setselectTipoProyecto] = useState<
    SelectProps["options"]
  >([]);

  const [selectTipoProcesos, setselectTipoProcesos] = useState<
    SelectProps["options"]
  >([]);

  const [usuariosCorreo, setUsuariosCorreo] = useState<SelectProps["options"]>(
    []
  );

  const [USuarios, selectUSuarios] = useState<SelectProps["options"]>([]);
  const [Ingeniero, selectIngeniero] = useState<SelectProps["options"]>([]);
  const [convenio, setConvenio] = useState<Proyectos>();
  const [loader, setLoader] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = useForm();

  //llamado a tipo de proyectps
  useEffect(() => {
    setLoader(true);
    const fetchSelects = async () => {
      await getTipoProyectos().then(({ data: { data } }) => {
        setselectTipoProyecto(
          data.map((item) => ({
            value: item.id,
            label: `(${item.id}) ${item.nombre_tipo}`,
          }))
        );
      });
    };
    fetchSelects()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoader(false));
  }, []);

  //llamado a procesos proyectps
  useEffect(() => {
    setLoader(true);
    const fetchSelects = async () => {
      await getProcesosProyectos().then(({ data: { data } }) => {
        setselectTipoProcesos(
          data.map((item) => ({
            value: item.id,
            label: item.nombre_proceso,
          }))
        );
      });
    };
    fetchSelects()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoader(false));
  }, []);

  //llamado de usuarios rol encargado de obra para asignar poryecto
  useEffect(() => {
    setLoader(true);
    const fetchSelects = async () => {
      await getUsersProyecto().then(({ data: { data } }) => {
        selectUSuarios(
          data.map((item) => ({
            value: item.id.toString(),
            label: item.nombre,
          }))
        );
      });
    };
    fetchSelects()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoader(false));
  }, []);

  // llamado de usuarios rol ingenieros para asignar poryecto
  useEffect(() => {
    setLoader(true);
    const fetchSelects = async () => {
      await getIngenieros().then(({ data: { data } }) => {
        selectIngeniero(
          data.map((item) => ({
            value: item.id.toString(),
            label: item.nombre,
          }))
        );
      });
    };
    fetchSelects()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoader(false));
  }, []);

  //llamado de usuarios para correo de obra
  useEffect(() => {
    setLoader(true);
    const fetchSelects = async () => {
      await getUsuariosCorreo().then(({ data: { data } }) => {
        setUsuariosCorreo(
          data.map((item) => ({
            value: item.id.toString(),
            label: item.nombre,
          }))
        );
      });
    };
    fetchSelects()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoader(false));
  }, []);

  useEffect(() => {
    if (id) {
      getProyectoID(id).then(({ data }) => {
        setConvenio(data);
        control.reset({
          tipoProyecto_id: data?.tipoProyecto_id?.toString(),
          cliente_id: data?.cliente_id?.toString(),
          usuario_crea_id: data?.usuario_crea_id?.toString(),
          encargado_id: data?.encargado_id?.toString(),
          ingeniero_id: data?.ingeniero_id?.toString(),
          emp_nombre: data?.emp_nombre?.toString(),
          nit: data?.nit?.toString(),
          descripcion_proyecto: data?.descripcion_proyecto,
          fecha_inicio: dayjs(data?.fecha_inicio),
          codigo_proyecto: data?.codigo_proyecto,
          torres: data?.torres,
          cant_pisos: data?.cant_pisos,
          apt: data?.apt,
          estado: data?.estado?.toString(),
          activador_pordia_apt: data?.activador_pordia_apt?.toString(),
          usuarios_notificacion: JSON.parse(data?.usuarios_notificacion),
        });
      });
    } else {
      control.reset({
        tipoProyecto_id: null,
        cliente_id: null,
        usuario_crea_id: null,
        encargado_id: null,
        ingeniero_id: null,
        descripcion_proyecto: "",
        fecha_inicio: "",
        codigo_proyecto: "",
        torres: null,
        cant_pisos: null,
        apt: null,
        estado: "1",
      });
    }
  }, [id]);

  const onFinish = (data: any) => {
    setLoader(true);
    if (convenio) {
      updateProyecto(data, id)
        .then(() => {
          notification.success({
            message: "Proyecto actualizado con éxito!",
          });
          setTimeout(() => {
            navigate("..");
          }, 800);
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores: string[] = Object.values(errors);
              for (const error of errores) {
                notification.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notification.open({
                type: "error",
                message: response.data.message,
              });
            }
            setLoader(false);
          }
        );
    } else {
      crearProyecto(data)
        .then(() => {
          notification.success({
            message: "Proyecto creado con éxito!",
          });
          setTimeout(() => {
            navigate(-1);
          }, 800);
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores: string[] = Object.values(errors);
              for (const error of errores) {
                notification.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notification.open({
                type: "error",
                message: response.data.message,
              });
            }
            setLoader(false);
          }
        );
    }
  };

  //html visual
  return (
    <>
      {/* {contextHolder} */}
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        <FormProvider {...control}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            autoComplete="off"
          >
            <StyledCard
              title={(convenio ? "Editar" : "Crear") + " proyecto"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {convenio ? (
                    <Link to="../.." relative="path">
                      <Button
                        danger
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                      >
                        Volver
                      </Button>
                    </Link>
                  ) : (
                    <Link to=".." relative="path">
                      <Button
                        danger
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                      >
                        Volver
                      </Button>
                    </Link>
                  )}
                </Space>
              }
            >
              {Object.keys(control.formState.errors).length > 0 ? (
                <Text type="danger">
                  Faltan campos por diligenciar o existen algunos errores
                </Text>
              ) : null}
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: "1",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                        Datos Básicos
                      </Text>
                    ),
                    children: <DatosBasicos usuariosCorreo={usuariosCorreo} />,
                  },
                  {
                    key: "2",
                    label: (
                      <Space>
                        <Text
                          type={
                            Object.keys(control.formState.errors).length > 0
                              ? "danger"
                              : undefined
                          }
                        >
                          Datos Proyecto
                        </Text>
                      </Space>
                    ),
                    children: (
                      <DatosFacturacion
                        selectTipoProyecto={selectTipoProyecto}
                        selectUSuarios={USuarios}
                        selectIngeniero={Ingeniero}
                      />
                    ),
                    forceRender: true,
                  },
                  // {
                  //   key: "3",
                  //   label: (
                  //     <Space>
                  //       <Text
                  //         type={
                  //           Object.keys(control.formState.errors).length > 0
                  //             ? "danger"
                  //             : undefined
                  //         }
                  //       >
                  //         Configurar Proyecto
                  //       </Text>
                  //     </Space>
                  //   ),
                  //   children: (
                  //     <DatosConfigProyecto
                  //       selectTipoProcesos={selectTipoProcesos}
                  //     />
                  //   ),
                  //   forceRender: true,
                  // },
                  ...(!id
                    ? [
                        {
                          key: "3",
                          label: (
                            <Space>
                              <Text
                                type={
                                  Object.keys(control.formState.errors).length >
                                  0
                                    ? "danger"
                                    : undefined
                                }
                              >
                                Configurar Proyecto
                              </Text>
                            </Space>
                          ),
                          children: (
                            <DatosConfigProyecto
                              selectTipoProcesos={selectTipoProcesos}
                            />
                          ),
                          forceRender: true,
                        },
                      ]
                    : []),
                ]}
                animated
              />
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  );
};
