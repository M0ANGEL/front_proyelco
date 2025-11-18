/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
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
} from "@ant-design/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DatosBasicos, ModulosPerfil } from "../../components";
import { Modulo, Perfil } from "@/types/auth.types";
import useSerialize from "@/hooks/useUpperCase";
import {
  crearPerfil,
  getPerfil,
  updatePerfil,
} from "@/services/administrarUsuarios/perfilesAPI";
import { getModulos } from "@/services/administrarUsuarios/modulosAPI";
import { StyledCard } from "@/components/layout/styled";
import { Notification } from "@/components/global/NotificationHandler";
import { BackButton } from "@/components/global/BackButton";
import { SaveButton } from "@/components/global/SaveButton";

const { Text } = Typography;

export const FormPerfiles = () => {
  const { id } = useParams<{ id: string }>();
  const [perfil, setPerfil] = useState<Perfil>();
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [loaderModulos, setLoaderModulos] = useState<boolean>(false);
  const [generalErrors, setGeneralErrors] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
                  <SaveButton loading={loading} />
                  <Link to={perfil ? "../.." : ".."} relative="path">
                    <BackButton />
                  </Link>
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
