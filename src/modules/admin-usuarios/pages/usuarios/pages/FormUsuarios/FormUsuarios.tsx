/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { DatosBasicos, DatosPerfiles } from "../../components";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { DatosCargos } from "../../components/DatosCargos";
import { useEffect, useState } from "react";
import {
  updateUsuario,
  crearUsuario,
  getUsuario,
} from "@/services/maestras/maestrasAPI";
import { Usuario } from "../../types";
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
  Tabs,
  Spin,
} from "antd";

const { Text } = Typography;

export const FormUsuarios = () => {
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const [usuario, setUsuario] = useState<Usuario>();
  const { transformToUpperCase } = useSerialize();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = useForm({
    defaultValues: {
      empresas: [],
      cargos: [],
      perfiles: [],
    },
  });

  useEffect(() => {
    if (id) {
      getUsuario(id ?? "")
        .then(({ data }) => {
          setUsuario(data);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.code,
            description: error.message,
          });
        })
        .finally(() => setLoaderSave(false));
    }
    setLoaderSave(false);
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
    data = transformToUpperCase(data, ["nombre"]);
    setLoaderSave(true);
    if (usuario) {
      updateUsuario(data, id)
        .then(({ data }) => {
          pushNotification({ title: data.message });
          setTimeout(() => {
            navigate("..");
          }, 800);
        })
        .catch(({ response: { data } }) => {
          pushNotification({
            type: "error",
            title: data.error,
            description: data.message,
          });
          setLoaderSave(false);
        });
    } else {
      if (control.getValues().empresas) {
        crearUsuario(data)
          .then(() => {
            pushNotification({ title: "Usuario creado con exito!" });
            setTimeout(() => {
              navigate(-1);
            }, 800);
          })
          .catch((error) => {
            const data = error.response.data;
            pushNotification({
              type: "error",
              title: data.error,
              description: data.message,
            });
            setLoaderSave(false);
          });
      } 
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
              title={(usuario ? "Editar" : "Crear") + " usuario"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>
                  {usuario ? (
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
                    children: <DatosBasicos usuario={usuario} />,
                  },

                  {
                    key: "2",
                    label: <Text>Perfiles</Text>,
                    children: <DatosPerfiles usuario={usuario} />,
                  },
                  {
                    key: "3",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                        Cargos
                      </Text>
                    ),
                    children: <DatosCargos usuario={usuario} />,
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
