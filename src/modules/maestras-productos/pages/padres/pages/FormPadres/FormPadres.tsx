/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductoPadre } from "@/services/types";
import {
  updateProductoPadre,
  crearProductoPadre,
  getProductoPadre,
} from "@/services/maestras/productosPadreAPI";
import { useEffect, useState } from "react";
import { DatosBasicos } from "../..";
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

export const FormPadres = () => {
  const { id } = useParams<{ id: string }>();
  const [productoPadre, setProductoPadre] = useState<ProductoPadre>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [notificationApi, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const control = useForm({ mode: "onChange" });

  useEffect(() => {
    if (id) {
      getProductoPadre(id ?? "")
        .then(({ data: { data } }) => {
          setProductoPadre(data);
          setLoaderSave(false);
        })
        .catch((error) => {
          notificationApi.error({
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
    if (productoPadre) {
      delete data.nit;
      updateProductoPadre(data, id)
        .then(() => {
          notificationApi.success({
            message: "Producto padre actualizado con exito!",
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
      crearProductoPadre(data)
        .then(() => {
          notificationApi.success({
            message: "Producto padre creado con exito!",
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
              title={(productoPadre ? "Editar" : "Crear") + " producto padre"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={
                      control.getFieldState("cod_padre").error ? true : false
                    }
                  >
                    Guardar
                  </Button>

                  {productoPadre ? (
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
                    children: <DatosBasicos productoPadre={productoPadre} />,
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
