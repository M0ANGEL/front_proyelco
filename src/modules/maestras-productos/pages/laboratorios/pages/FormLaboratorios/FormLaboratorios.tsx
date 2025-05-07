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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {Laboratorios} from "@/services/types";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { DatosBasicos } from "../../componentes";
import { crearLaboratorio, getLaboratorio, updateLaboratorio } from "@/services/maestras/laboratoriosAPI";
import dayjs from "dayjs";

const { Text } = Typography;

export const FormLaboratorios = () => {
  const { id } = useParams<{ id: string }>();
  const [laboratorio, setLaboratorio] = useState<Laboratorios>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [accion, setAccion] = useState<string>("");
  const navigate = useNavigate();
  const control = useForm({ mode: "onChange" });

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const accion = url_split[4];

    setAccion(accion);
    if (id) {
      getLaboratorio(id ?? "")
        .then(({ data: { data } }) => {
          console.log(data);
          setLaboratorio(data);
          setLoaderSave(false);
        })
        .catch((error) => {
          notificationApi.error({
            type: "error",
            message: error.code,
            description: error.message,
          });
          setLoaderSave(false);
        });
    } else {
      setLoaderSave(false);
    }

  }, []);

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);
    if (laboratorio) {
      delete data.nit;
      updateLaboratorio(data, id)
        .then(() => {
          notificationApi.success({
            message: "Laboratorio actualizado con exito!",
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
      crearLaboratorio(data)
        .then(() => {
          notificationApi.success({ message: "Laboratorio creado con exito!" });
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
              title={(laboratorio ? "Editar" : "Crear") + " Laboratorio"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {laboratorio ? (
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
                        laboratorio={laboratorio}
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
