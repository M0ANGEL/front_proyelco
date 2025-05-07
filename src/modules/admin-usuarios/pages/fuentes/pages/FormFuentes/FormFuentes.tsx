/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { DatosBasicos } from "../../components";
import { useEffect, useState } from "react";
import { Fuentes } from "@/services/types";
import {
  updateFuente,
  crearFuente,
  getFuente,
} from "@/services/maestras/fuentesAPI";
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

export const FormFuentes = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const { transformToUpperCase } = useSerialize();
  const [fuente, setFuente] = useState<Fuentes>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getFuente(id ?? "").then(({ data: { data } }) => {
        setFuente(data);
        setLoaderSave(false);
      });
    } else {
      setLoaderSave(false);
    }
  }, []);

  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, ["prefijo", "descripcion"]);
    setLoaderSave(true);
    if (fuente) {
      updateFuente(data, id)
        .then(() => {
          notificationApi.success({ message: "Fuente actualizada con exito!" });
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
      crearFuente(data)
        .then(() => {
          notificationApi.success({ message: "Fuente creada con exito!" });
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
              title={(fuente ? "Editar" : "Crear") + " fuente"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {fuente ? (
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
                    children: <DatosBasicos fuente={fuente} />,
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
