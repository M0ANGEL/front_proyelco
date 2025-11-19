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
import { Link, useNavigate, useParams } from "react-router-dom";
import { DatosBasicos } from "../components";
import {
  crearActiActivo,
  getActiActivo,
  updateActiActivo,
} from "@/services/activosFijos/CrearActivosAPI";
import { ActivosData } from "@/types/typesGlobal";
import { notify } from "@/components/global/NotificationHandler";
import { StyledCard } from "@/components/layout/styled";

const { Text } = Typography;

export const FormCrearActivos = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const [categoria, setCategoria] = useState<ActivosData>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    //si hay un id ejecutamos una consulta para traer datos de esa categoria
    if (id) {
      getActiActivo(id).then(({ data }) => {
        setCategoria(data);
        setLoaderSave(false);
      });
    } else {
      setLoaderSave(false);
    }
  }, [id]);

  //guardado de los datos
  const onFinish: SubmitHandler<any> = async (data) => {

    setLoaderSave(true);

    if (categoria) {
      updateActiActivo(data, id)
        .then(() => {
          notify.success("Activo actualizado con éxito!");
          setTimeout(() => {
            navigate("..");
          }, 800);
        })
        .catch((error) => {
          // Manejo de error si ya existen tickets con el prefijo
          notify.error(error);
          setLoaderSave(false);
        });
    } else {
      crearActiActivo(data)
        .then(() => {
          notify.success("Activo creado con éxito!");
          setTimeout(() => {
            navigate(-1);
          }, 800);
        })
        .catch((error) => {
          notify.error("NUMERO DE ACTIVO EN USO || " + error.message);
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
              title={(categoria ? "Editar" : "Crear") + " Categoria"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
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
