import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Form,
  notification,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import { Dotacion } from "@/services/types";
import { DatosBasicos } from "../../components/DatosBasicos";
import { crearDotacion } from "@/services/gestion-humana/dotacionesAPI";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import {
  getDotacion,
  updateDotacion,
} from "@/services/gestion-humana/dotacionesAPI";

const { Text } = Typography;
export const FormDotaciones = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const [dotacion, setDotacion] = useState<Dotacion>();
  const navigate = useNavigate();
  const { transformToUpperCase } = useSerialize();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      getDotacion(id).then(({ data }) => {
        setDotacion(data);
        setLoaderSave(false);
      });
    } else {
      setDotacion(undefined);
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
    data = transformToUpperCase(data, ["tipo", "talla"]);
    setLoaderSave(true);

    if (dotacion) {
      updateDotacion(data, id)
        .then((res) => {
          pushNotification({ title: res.data.message });
          setTimeout(() => {
            navigate("..");
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
    } else {
      crearDotacion(data)
        .then((res) => {
          pushNotification({ title: res.data.message });
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
              title={(dotacion ? "Editar" : "Crear") + " Dotación"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={!["gh_admin", "gh_bienestar", "administrador"].includes(user_rol)}
                  >
                    Guardar
                  </Button>

                  {dotacion ? (
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
                    children: <DatosBasicos dotacion={dotacion} />,
                  },
                ]}
              />
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  );
};
