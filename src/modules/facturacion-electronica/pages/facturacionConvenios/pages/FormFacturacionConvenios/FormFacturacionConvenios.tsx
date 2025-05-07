/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos } from "../../components";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  ConveniosFacturacion,
  Empresa,
  Resolucion,
  UsuariosFacturacion,
} from "@/services/types";
import { Link } from "react-router-dom";
import { getEmpresas } from "@/services/maestras/empresasAPI";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Space,
  Spin,
  Tabs,
  Typography,
  notification,
} from "antd";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import {
  crearConvenioFacturacion,
  getConvenio,
  getUsuariosFacturacion,
  updateConvenioFacturacion,
} from "@/services/facturacion/facturacionConveniosAPI";

const { Text } = Typography;

export const FormFacturacionConvenios = () => {
  const { id } = useParams<{ id: string }>();
  const [convenioFacturacion, setConvenioFacturacion] =
    useState<ConveniosFacturacion>();
  const [usuariosFacturacion, setUsuariosFacturacion] =
    useState<UsuariosFacturacion>();
  const [empresas, setEmpresas] = useState<Empresa[]>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const [accion, setAccion] = useState<string>("");
  const { transformToUpperCase } = useSerialize();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const accion = url_split[4];

    setAccion(accion);
    if (id) {
      getConvenio(id ?? "")
        .then(({ data: { data } }) => {
          setConvenioFacturacion(data);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.code,
            description: error.message,
          });
        })
        .finally(() => setLoaderSave(false));
    } else {
      getUsuariosFacturacion().then(({ data: { data } }) => {
        setUsuariosFacturacion(data);
        setLoaderSave(false);
      });
    }
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
    data = transformToUpperCase(data, ["prefijo"]);
    setLoaderSave(true);
    if (convenioFacturacion) {
      updateConvenioFacturacion(data, id)
        .then(() => {
          pushNotification({ title: "Permiso actualizado con exito!" });
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
            setLoaderSave(false);
          }
        );
    } else {
      crearConvenioFacturacion(data)
        .then(() => {
          pushNotification({ title: "Permiso creado con exito!" });
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
              title={(convenioFacturacion ? "Editar" : "Crear") + " Resolución"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {convenioFacturacion ? (
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
                        onPushNotification={(data: Notification) =>
                          pushNotification(data)
                        }
                        convenioFacturacion={convenioFacturacion}
                        // usuariosFacturacion={usuariosFacturacion}
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
