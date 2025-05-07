/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Form,
  Space,
  Spin,
  Tabs,
  Typography,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DatosBasicos, ModulosPerfil } from "../../components";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import {
  crearPerfil,
  getPerfil,
  updatePerfil,
} from "@/services/maestras/perfilesAPI";
import { Modulo, Perfil } from "@/services/types";
import { getModulos } from "@/services/maestras/modulosAPI";
import useSerialize from "@/modules/common/hooks/useUpperCase";

const { Text } = Typography;

export const FormPerfiles = () => {
  const { id } = useParams<{ id: string }>();
  const [perfil, setPerfil] = useState<Perfil>();
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [loaderModulos, setLoaderModulos] = useState<boolean>(false);
  const [generalErrors, setGeneralErrors] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const { transformToUpperCase } = useSerialize();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getPerfil(id ?? "").then(({ data }) => {
        setPerfil(data);
        setLoaderSave(false);
      });
    }
    setLoaderModulos(true);
    getModulos()
      .then(({ data }) => {
        setModulos(data);
        setLoaderModulos(false);
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

  const onFinish: SubmitHandler<any> = async (data: any) => {
    data = transformToUpperCase(data, ["nom_perfil", "desc_perfil"]);
    setLoaderSave(true);
    if (control.getValues("modulos")) {
      control.clearErrors;
      if (perfil) {
        updatePerfil(data, id).then(() => {
          pushNotification({ title: "Perfil actualizado con exito!" });
          setTimeout(() => {
            navigate("..");
          }, 800);
        });
      } else {
        crearPerfil(data)
          .then(() => {
            pushNotification({ title: "Perfil creado con exito!" });
            setTimeout(() => {
              navigate(-1);
            }, 800);
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
    } else {
      setLoaderSave(false);
      setGeneralErrors(true);
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
              title={(perfil ? "Editar" : "Crear") + " perfil"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {perfil ? (
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
              {Object.keys(control.formState.errors).length > 0 ||
              generalErrors ? (
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
                        perfil={perfil}
                      />
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <Space>
                        <Text
                          disabled={loaderModulos}
                          type={
                            Object.keys(control.formState.errors).length > 0 ||
                            generalErrors
                              ? "danger"
                              : undefined
                          }
                        >
                          Modulos
                        </Text>
                        {loaderModulos ? (
                          <Spin spinning indicator={<LoadingOutlined spin />} />
                        ) : null}
                      </Space>
                    ),
                    children: (
                      <ModulosPerfil perfil={perfil} modulos={modulos} />
                    ),
                    forceRender: perfil ? true : false,
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
