/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Form,
  Space,
  Spin,
  Tabs,
  Typography,
  notification,
} from "antd";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Localidades, Tercero, TerceroTipo } from "@/services/types";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { DatosBasicos } from "../../components";
import {
  crearTercero,
  getTercero,
  updateTercero,
} from "@/services/admin-terceros/tercerosAPI";
import { getTerceroTipos } from "@/services/admin-terceros/tercerosTipoAPI";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { getLocalidades } from "@/services/maestras/localidadesAPI";

const { Text } = Typography;

export const FormTerceros = () => {
  const { id } = useParams<{ id: string }>();
  const [tercero, setTercero] = useState<Tercero>();
  const [tercerotipos, setTerceroTipos] = useState<TerceroTipo[]>([]);
  const [localidades, setLocalidades] = useState<Localidades[]>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const { transformToUpperCase } = useSerialize();
  const navigate = useNavigate();
  const control = useForm({ mode: "onChange" });

  useEffect(() => {
    if (id) {
      getTercero(id ?? "")
        .then(({ data }) => {
          setTercero(data);
          setLoaderSave(false);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.code,
            description: error.message,
          });
          setLoaderSave(false);
        });
    } else {
      setLoaderSave(false);
    }
    getTerceroTipos().then(({ data: { data } }) => {
      setTerceroTipos(data);
    });
    getLocalidades().then(({ data: { data } }) => {
      setLocalidades(data);
    });
  }, []);

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

  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, [
      "nombre",
      "razon_soc",
      "nombre1",
      "nombre2",
      "apellido1",
      "apellido2",
    ]);
    setLoaderSave(true);
    if (tercero) {
      updateTercero(data, id)
        .then(() => {
          pushNotification({ title: "Tercero actualizado con exito!" });
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
                api.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              api.open({
                type: "error",
                message: response.data.message,
              });
            }
          }
        )
        .finally(() => {
          setLoaderSave(false);
        });
    } else {
      crearTercero(data)
        .then(() => {
          pushNotification({ title: "Tercero creado con exito!" });
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
                api.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              api.open({
                type: "error",
                message: response.data.message,
              });
            }
          }
        )
        .finally(() => {
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
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        <FormProvider {...control}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            autoComplete="off"
          >
            <StyledCard
              title={(tercero ? "Editar" : "Crear") + " tercero"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={loaderSave}
                  >
                    Guardar
                  </Button>

                  {tercero ? (
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
                        Datos Basicos
                      </Text>
                    ),
                    children: (
                      <DatosBasicos
                        tercero={tercero}
                        tercerotipos={tercerotipos}
                        localidades={localidades}
                      />
                    ),
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
