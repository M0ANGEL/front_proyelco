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
  message,
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
import { DatosBasicos } from "../../components";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { Entidad } from "@/services/types";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { crearEntidades, updateEntidad, getEntidad } from "@/services/maestras/entidadesAPI";

const { Text } = Typography;

export const FormEntidades = () => {
  const { id } = useParams<{ id: string }>();
  const [entidad, setEntidad] = useState<Entidad>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const { transformToUpperCase } = useSerialize();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getEntidad(id ?? "").then(({ data }) => {
        setEntidad(data);
        setLoaderSave(false);
      });
    } else {
      setLoaderSave(false);
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
    data = transformToUpperCase(data, ["nombre"]);
    setLoaderSave(true);
    if (entidad) {
      updateEntidad(data, id).then(() => {
        message.open({
          type: "success",
          content: "Entidad actualizada exitosamente!",
        });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearEntidades(data)
        .then(() => {
          message.open({
            type: "success",
            content: "Entidad creada con éxito!",
          });
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
              title={(entidad ? "Editar" : "Crear") + " Entidad"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {entidad ? (
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
                      <DatosBasicos
                        onPushNotification={(data: Notification) =>
                          pushNotification(data)
                        }
                        entidad={entidad}
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
