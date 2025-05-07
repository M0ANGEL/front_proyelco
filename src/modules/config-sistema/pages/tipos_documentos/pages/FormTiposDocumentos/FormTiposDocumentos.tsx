/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos } from "../../components";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Empresa, Grupo, TipoDocumento, Cabeceras } from "@/services/types";
import { Link } from "react-router-dom";
import { getEmpresas } from "@/services/maestras/empresasAPI";
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
import { getGrupos } from "@/services/maestras/gruposAPI";
import {
  crearTipoDocumento,
  getTipoDocumento,
  updateTipoDocumento,
} from "@/services/maestras/tiposDocumentosAPI";
import { DatosBasicosCampos } from "../../components/index";
import { getCabeceras } from "@/services/maestras/cabecerasAPI";

const { Text } = Typography;

export const FormTiposDocumentos = () => {
  const { id } = useParams<{ id: string }>();
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const [cabeceras, setCabeceras] = useState<Cabeceras[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>();
  const [grupos, setGrupos] = useState<Grupo[]>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getTipoDocumento(id ?? "")
        .then(({ data }) => {
          setTipoDocumento(data);
          getEmpresas().then(({ data: { data } }) => {
            setEmpresas(data);
            getGrupos().then(({ data }) => {
              setGrupos(data);
              getCabeceras().then(({ data }) => {
                setCabeceras(data);
                setLoaderSave(false);
              });
            });
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
      getEmpresas().then(({ data: { data } }) => {
        setEmpresas(data);
        getGrupos().then(({ data }) => {
          setGrupos(data);
          getCabeceras().then(({ data }) => {
            setCabeceras(data);
            setLoaderSave(false);
          });
        });
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
    if (tipoDocumento) {
      updateTipoDocumento(data, id).then(() => {
        pushNotification({ title: "Tipo de documento actualizado con exito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearTipoDocumento(data)
        .then(() => {
          pushNotification({ title: "Tipo de documento creado con exito!" });
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
              title={(tipoDocumento ? "Editar" : "Crear") + " tipo documento"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {tipoDocumento ? (
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
                      <DatosBasicos
                        tipoDocumento={tipoDocumento}
                        empresas={empresas}
                        grupos={grupos}
                      />
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                        Campos Cabecera
                      </Text>
                    ),
                    children: (
                      <DatosBasicosCampos
                        tipoDocumento={tipoDocumento}
                        cabeceras={cabeceras}
                      />
                    ),
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
