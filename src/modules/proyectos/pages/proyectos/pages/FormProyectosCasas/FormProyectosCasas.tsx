/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

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
  getIngenieros,
  getUsersProyecto,
  getUsuariosCorreo,
} from "@/services/proyectos/masAPI";
import { Proyectos } from "@/types/typesGlobal";
import { StyledCard } from "@/components/layout/styled";
import { DatosBasicosCasa } from "./components/DatosBasicosCasa";
import { DatosGestionCasa } from "./components/DatosGestionCasa";
import { getProyectoIDCasas, updateProyectoCasa } from "@/services/proyectos/casasProyectosAPI";

const { Text } = Typography;

type Proceso = {
  proyecto_id: number;
  numero: string;
  proceso: string;
  nombre_proceso: string;
};

export const FormProyectosCasas = () => {
  const [usuariosCorreo, setUsuariosCorreo] = useState<SelectProps["options"]>(
    []
  );

  const [dataProcesos, setDataProcesos] = useState<Proceso[]>([]);

  const [USuarios, selectUSuarios] = useState<SelectProps["options"]>([]);
  const [Ingeniero, selectIngeniero] = useState<SelectProps["options"]>([]);
  const [convenio, setConvenio] = useState<Proyectos>();
  const [loader, setLoader] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = useForm();

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
      getProyectoIDCasas(id).then(({ data }) => {
        setConvenio(data);
        control.reset({
          tipoProyecto_id: data?.proyecto.tipoProyecto_id?.toString(),
          cliente_id: data?.proyecto.cliente_id?.toString(),
          usuario_crea_id: data?.proyecto.usuario_crea_id?.toString(),
          emp_nombre: data?.proyecto.emp_nombre?.toString(),
          nit: data?.proyecto.nit?.toString(),
          descripcion_proyecto: data?.proyecto.descripcion_proyecto,
          fecha_inicio: dayjs(data?.proyecto.fecha_inicio),
          codigo_proyecto: data?.proyecto.codigo_proyecto,
          torres: data?.proyecto.torres,
          cant_pisos: data?.proyecto.cant_pisos,
          apt: data?.proyecto.apt,
          minimoApt: data?.proyecto.minimoApt,
          estado: data?.proyecto.estado?.toString(),
          activador_pordia_apt: data?.proyecto.activador_pordia_apt?.toString(),
          usuarios_notificacion: JSON.parse(
            data?.proyecto.usuarios_notificacion
          ),
          encargado_id: JSON.parse(data?.proyecto.encargado_id),
          ingeniero_id: JSON.parse(data?.proyecto.ingeniero_id),
          proceso: data.procesos,
        });
        setDataProcesos(data.procesos);
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
        minimoApt: "",
      });
    }
  }, [id]);

  const onFinish = (data: any) => {
    setLoader(true);
      updateProyectoCasa(data, id)
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
              title={(convenio ? "Editar" : "Crear") + " proyecto Casas"}
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
                    children: (
                      <DatosBasicosCasa usuariosCorreo={usuariosCorreo} />
                    ),
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
                      <DatosGestionCasa
                        selectUSuarios={USuarios}
                        selectIngeniero={Ingeniero}
                        procesos={dataProcesos}
                      />
                    ),
                    forceRender: true,
                  },
                  // ...(!id
                  //   ? [
                  //       {
                  //         key: "3",
                  //         label: (
                  //           <Space>
                  //             <Text
                  //               type={
                  //                 Object.keys(control.formState.errors).length >
                  //                 0
                  //                   ? "danger"
                  //                   : undefined
                  //               }
                  //             >
                  //               Configurar Proyecto
                  //             </Text>
                  //           </Space>
                  //         ),
                  //         children: (
                  //           <DatosConfigProyecto
                  //             selectTipoProcesos={selectTipoProcesos}
                  //             selectTipoProyecto={selectTipoProyecto}
                  //           />
                  //         ),
                  //         forceRender: true,
                  //       },
                  //     ]
                  //   : []),
                  // ...(id
                  //   ? [
                  //       {
                  //         key: "4",
                  //         label: (
                  //           <Space>
                  //             <Text
                  //               type={
                  //                 Object.keys(control.formState.errors).length >
                  //                 0
                  //                   ? "danger"
                  //                   : undefined
                  //               }
                  //             >
                  //               Editar Nomenclaturas
                  //             </Text>
                  //           </Space>
                  //         ),
                  //         children: <Nomenclaturas />,
                  //       },
                  //     ]
                  // : []),
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
