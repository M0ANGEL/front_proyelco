/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos } from "../../components";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Menu, Modulo } from "@/services/types";
import { Link } from "react-router-dom";
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
import { crearMenu, getMenu, updateMenu } from "@/services/maestras/menuAPI";
import { getModulos } from "@/services/maestras/modulosAPI";

const { Text } = Typography;

export const FormMenu = () => {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<Menu>();
  const [modulos, setModulos] = useState<Modulo[]>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getMenu(id ?? "")
        .then(({ data }) => {
          setMenu(data);
          getModulos()
            .then(({ data }) => {
              setModulos(data);
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
      getModulos()
        .then(({ data }) => {
          setModulos(data);
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
    if (menu) {
      updateMenu(data, id).then(() => {
        pushNotification({ title: "Menu actualizado con exito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearMenu(data)
        .then(() => {
          pushNotification({ title: "Menu creado con exito!" });
          setTimeout(() => {
            navigate(-1);
          }, 800);
        })
        .catch(
          ({
            response: {
              data: { errors },
            },
          }) => {
            const errores: string[] = Object.values(errors);

            for (const error of errores) {
              pushNotification({
                type: "error",
                title: error,
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
              title={(menu ? "Editar" : "Crear") + " menu"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {menu ? (
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
                    children: <DatosBasicos menu={menu} modulos={modulos} />,
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
