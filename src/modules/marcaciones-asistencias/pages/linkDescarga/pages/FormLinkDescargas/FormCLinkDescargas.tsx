import { useEffect, useState } from "react";
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
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { TkCategoria } from "@/services/types";
import { DatosBasicos } from "../components/DatosBasicos";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import {
  crearTkCategoria,
  getTkCategoria,
  updateTkCategoria,
} from "@/services/tickets/categoriasAPI";
import { crearMaLink } from "@/services/marcaciones-asistencias/ma_linkDescargasApi";

const { Text } = Typography;

export const FormCLinkDescargas = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const [categoria, setCategoria] = useState<TkCategoria>();
  const { transformToUpperCase } = useSerialize();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    //si hay un id ejecutamos una consulta para traer datos de esa categoria
    if (id) {
      getTkCategoria(id).then(({ data }) => {
        setCategoria(data);
        setLoaderSave(false);
      });
    } else {
      setLoaderSave(false);
    }
  }, []);

  //notificacion de los estados
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

  //guardado de los datos
  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, ["nombre"]);

    setLoaderSave(true);

    if (categoria) {
      updateTkCategoria(data, id)
        .then(() => {
          pushNotification({ title: "Categoría actualizada con éxito!" });
          setTimeout(() => {
            navigate("..");
          }, 800);
        })
        .catch((error) => {
          // Manejo de error si ya existen tickets con el prefijo
          if (
            error.response?.data?.message?.includes(
              "No se puede inactivar porque hay tickets con este prefijo"
            )
          ) {
            pushNotification({
              type: "error",
              title: "Error",
              description:
                "No se puede actualizar porque hay tickets con este prefijo.",
            });
          } else {
            pushNotification({
              type: "error",
              title: "Error al actualizar",
              description: error.message || "Ocurrió un error inesperado",
            });
          }
          setLoaderSave(false);
        });
    } else {
      crearMaLink(data)
        .then(() => {
          pushNotification({ title: "Categoría creada con éxito!" });
          setTimeout(() => {
            navigate(-1);
          }, 800);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.error,
            description: error.response?.data?.errors?.prefijo
              ? "PREFIJO EN USO"
              : error.message,
          });
          setLoaderSave(false);
        });
    }
  };

  //retorno ed la vista
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
              title={(categoria ? "Editar" : "Crear") + " Link descarga APK"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={
                      <SaveOutlined />
                    } /* disabled={!['admin'].includes(user_rol)} */
                  >
                    Guardar
                  </Button>

                  {categoria ? (
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
                      /* campos de input datos basicos */
                      <DatosBasicos TkCategoria={categoria} />
                    ),
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
