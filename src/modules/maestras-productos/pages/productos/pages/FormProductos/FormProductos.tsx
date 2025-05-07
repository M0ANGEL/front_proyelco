/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSubGruposProducto } from "@/services/maestras/productoSubgrupoAPI";
import { DatosBasicos, DatosInvima, DatosRegulacion } from "../../components";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { getGruposProducto } from "@/services/maestras/productoGrupoAPI";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getIvasProducto } from "@/services/maestras/ivasAPI";
import { useEffect, useState } from "react";
import {
  updateProducto,
  crearProducto,
  getProducto,
} from "@/services/maestras/productosAPI";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  SubGrupoProducto,
  GrupoProducto,
  IvaProducto,
  Producto,
  FormaFarma,
} from "@/services/types";
import {
  notification,
  Typography,
  Button,
  Space,
  Form,
  Spin,
  Tabs,
} from "antd";
import { getReferencias, getTipoMedicamento, getUpr } from "@/services/maestras/productosReferenciasAPI";

const { Text } = Typography;

export const FormProductos = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [subgrupos, setSubgrupos] = useState<SubGrupoProducto[]>([]);
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [grupos, setGrupos] = useState<GrupoProducto[]>([]);
  const [producto, setProducto] = useState<Producto>();
  const [ivas, setIvas] = useState<IvaProducto[]>([]);
  const [formaFarma, setFormaFarma] = useState<FormaFarma[]>([]);
  const [tipoMedicamento, setTipoMedicamento] = useState<FormaFarma[]>([]);
  const [upr, setUpr] = useState<FormaFarma[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getProducto(id ?? "")
        .then(({ data: { data } }) => {
          setProducto(data);
          setLoaderSave(false);
        })
        .catch((error) => {
          notificationApi.error({
            type: "error",
            message: error.code,
            description: error.message,
          });
          setLoaderSave(false);
        });
    } else {
      setLoaderSave(false);
    }
    getGruposProducto().then(({ data: { data } }) => {
      setGrupos(data);
      getSubGruposProducto().then(({ data: { data } }) => {
        setSubgrupos(data);
        getIvasProducto().then(({ data: { data } }) => {
          setIvas(data);
        });
      });
    });
    getReferencias().then(({ data: { data } }) => {
      setFormaFarma(data);
    });

    getUpr().then(({ data: { data } }) => {
      setUpr(data);
    });

    getTipoMedicamento().then(({ data: { data } }) => {
      setTipoMedicamento(data);
    });

  }, []);

  const onFinish: SubmitHandler<any> = async (data) => {
    data.fecha_vig_invima = dayjs(data.fecha_vig_invima).format("DD/MM/YYYY");
    setLoaderSave(true);
    if (producto) {
      delete data.nit;
      updateProducto(data, id)
        .then(() => {
          notificationApi.success({
            message: "Producto actualizado con exito!",
          });
          setTimeout(() => {
            navigate("..");
          }, 800);
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores: string[] = Object.values(errors);
              for (const error of errores) {
                notificationApi.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
              });
            }
            setLoaderSave(false);
          }
        );
    } else {
      crearProducto(data)
        .then(() => {
          notificationApi.success({ message: "Producto creado con exito!" });
          setTimeout(() => {
            navigate(-1);
          }, 800);
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores: string[] = Object.values(errors);
              for (const error of errores) {
                notificationApi.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
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
              title={(producto ? "Editar" : "Crear") + " producto"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {producto ? (
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
                        producto={producto}
                        grupos={grupos}
                        subgrupos={subgrupos}
                        ivas={ivas}
                        formaFarma={formaFarma}
                        upr={upr}
                        tipoMedicamento={tipoMedicamento}
                      />
                    ),
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
                          Datos Invima
                        </Text>
                      </Space>
                    ),
                    children: <DatosInvima />,
                    forceRender: true,
                  },
                  {
                    key: "3",
                    label: (
                      <Space>
                        <Text
                          type={
                            Object.keys(control.formState.errors).length > 0
                              ? "danger"
                              : undefined
                          }
                        >
                          Datos Regulación
                        </Text>
                      </Space>
                    ),
                    children: <DatosRegulacion />,
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
