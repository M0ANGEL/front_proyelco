/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { CampoDispensacion, TipoDispensacion } from "@/services/types";
import { DatosBasicosCampos } from "../../components/index";
import { useNavigate, useParams } from "react-router";
import {
  updateTipoDispensacion,
  crearTipoDispensacion,
  getTipoDispensacion,
  getCampos,
} from "@/services/maestras/tiposDispensacionesAPI";
import { DatosBasicos } from "../../components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  notification,
  Typography,
  Button,
  Space,
  Form,
  Spin,
  Tabs,
} from "antd";

const { Text } = Typography;

export const FormTiposDispensacion = () => {
  const [tipoDispensacion, setTipoDispensacion] = useState<TipoDispensacion>();
  const [campos, setCampos] = useState<CampoDispensacion[]>([]);
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [notificationApi, contextHolder] = notification.useNotification();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getTipoDispensacion(id ?? "")
        .then(({ data: { data } }) => {
          setTipoDispensacion(data);
          getCampos().then(({ data: { data } }) => {
            setCampos(data);
            setLoaderSave(false);
          });
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
                notificationApi.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
              });
            }
            setLoaderSave(false);
          }
        );
    } else {
      getCampos().then(({ data: { data } }) => {
        setCampos(data);
        setLoaderSave(false);
      });
    }
  }, []);

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);
    if (tipoDispensacion) {
      updateTipoDispensacion(data, id)
        .then(() => {
          notificationApi.success({
            message: "Tipo de dispensación actualizada con exito!",
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
                notificationApi.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
              });
            }
            setLoaderSave(false);
          }
        );
    } else {
      crearTipoDispensacion(data)
        .then(() => {
          notificationApi.success({
            message: "Tipo de dispensación creada con exito!",
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
                notificationApi.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
              });
            }
            setLoaderSave(false);
          }
        );
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
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        <FormProvider {...control}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            autoComplete="off"
          >
            <StyledCard
              title={
                (tipoDispensacion ? "Editar" : "Crear") +
                " Tipo de Dispensación"
              }
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {tipoDispensacion ? (
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
                      <DatosBasicos tipoDispensacion={tipoDispensacion} />
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                        Campos Dispensación
                      </Text>
                    ),
                    children: (
                      <DatosBasicosCampos
                        tipoDispensacion={tipoDispensacion}
                        campos={campos}
                      />
                    ),
                    forceRender: true,
                  },
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
