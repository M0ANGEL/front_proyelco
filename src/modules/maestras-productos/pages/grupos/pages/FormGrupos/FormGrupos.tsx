/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Form,
  Space,
  Spin,
  Tabs,
  Typography,
  notification,
} from "antd";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GrupoProducto } from "@/services/types";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { DatosBasicos } from "../../components";
import {
  crearGrupoProducto,
  getGrupoProducto,
  updateGrupoProducto,
} from "@/services/maestras/productoGrupoAPI";

const { Text } = Typography;

export const FormGrupos = () => {
  const { id } = useParams<{ id: string }>();
  const [grupo, setGrupo] = useState<GrupoProducto>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const control = useForm({ mode: "onChange" });

  useEffect(() => {
    if (id) {
      getGrupoProducto(id ?? "")
        .then(({ data }) => {
          setGrupo(data);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.code,
            description: error.message,
          });
        })
        .finally(() => {
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
    if (grupo) {
      delete data.nit;
      updateGrupoProducto(data, id).then(() => {
        pushNotification({ title: "Grupo actualizado con exito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearGrupoProducto(data)
        .then(() => {
          pushNotification({ title: "Grupo creado con exito!" });
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
              title={(grupo ? "Editar" : "Crear") + " grupo"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {grupo ? (
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
                    children: <DatosBasicos grupo={grupo} />,
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
