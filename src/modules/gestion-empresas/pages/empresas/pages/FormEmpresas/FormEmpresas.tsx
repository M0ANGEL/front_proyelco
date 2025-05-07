/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos, DatosSMTP } from "../../components";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Empresa } from "@/services/types";
import { Link } from "react-router-dom";
import {
  crearEmpresa,
  getEmpresa,
  updateEmpresa,
} from "@/services/maestras/empresasAPI";
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

const { Text } = Typography;

export const FormEmpresas = () => {
  const { id } = useParams<{ id: string }>();
  const [empresa, setEmpresa] = useState<Empresa>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getEmpresa(id ?? "")
        .then(({ data: { data } }) => {
          setEmpresa(data);
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
    setLoaderSave(true);
    if (empresa) {
      delete data.nit;
      updateEmpresa(data, id).then(() => {
        pushNotification({ title: "Empresa actualizada con éxito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearEmpresa(data)
        .then(() => {
          pushNotification({ title: "Empresa creada con éxito!" });
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
              title={(empresa ? "Editar" : "Crear") + " empresa"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {empresa ? (
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
                    children: <DatosBasicos empresa={empresa} />,
                  },
                  {
                    key: "2",
                    label: (
                      <Space>
                        <Text
                          type={
                            Object.keys(control.formState.errors).length > 0
                              ? "danger"
                              : undefined
                          }
                        >
                          Configuración SMTP
                        </Text>
                      </Space>
                    ),
                    children: <DatosSMTP />,
                    forceRender: true,
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
