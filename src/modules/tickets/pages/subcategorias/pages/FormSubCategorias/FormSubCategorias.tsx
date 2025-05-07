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
import { TkSubCategoria } from "@/services/types";
import { DatosBasicos } from "../components/DatosBasicos";
import {
  crearTkSubCategoria,
  getTkSubCategoria,
  updateTkSubCategoria,
} from "@/services/tickets/subcategoriasAPI";

const { Text } = Typography;

export const FormSubCategorias = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const [subcategoria, setSubcategoria] = useState<TkSubCategoria>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  //efecto de carga
  useEffect(() => {
    //si hay un id ejecutamos una consulta para traer datos de esa categoria
    if (id) {
      getTkSubCategoria(id).then(({ data }) => {
        setSubcategoria(data);
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

  //envio de guardado de los datos
  const onFinish: SubmitHandler<any> = async (data) => {
    
    setLoaderSave(true);
    if (subcategoria) {
      updateTkSubCategoria(data, id).then(() => {
        pushNotification({ title: "SubCategoria actualizada con exito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      //crear registro de subcategoria
      crearTkSubCategoria(data)
        .then(() => {
          pushNotification({ title: "SubCategoria creada con exito!" });
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
              title={(subcategoria ? "Editar" : "Crear") + " Categoria"}
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

                  {subcategoria ? (
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
                      <DatosBasicos TkSubCategoria={subcategoria} />
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
