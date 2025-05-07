/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { CuotaModeradora } from "@/services/types";
import {
  updateCuotaModeradora,
  crearCuotaModeradora,
  getCuotaModeradora,
} from "@/services/maestras/cuotaModeradoraAPI";
import { DatosBasicos } from "../../components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  notification,
  Typography,
  Button,
  Space,
  Form,
  Spin,
  Tabs,
} from "antd";

const { Text } = Typography;

export const FormCuotas = () => {
  const [cuotamoderadora, setCuotaModeradora] = useState<CuotaModeradora>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getCuotaModeradora(id)
        .then(({ data: { data } }) => {
          setCuotaModeradora(data);
          setLoaderSave(false);
        })
        .catch((error) => {
          api.error({ message: error.message });
          setLoaderSave(false);
        });
    } else {
      setLoaderSave(false);
    }
  }, [id]);

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);
    data.tipo_regimen = JSON.stringify(data.tipo_regimen);
    if (cuotamoderadora) {
      updateCuotaModeradora(data, id)
        .then(() => {
          api.success({ message: "Cuota moderadora actualizado con exito!" });
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
                api.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              api.open({
                type: "error",
                message: response.data.message,
              });
            }
            setLoaderSave(false);
          }
        );
    } else {
      crearCuotaModeradora(data)
        .then(() => {
          api.success({ message: "Cuota moderadora creada con exito!" });
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
                api.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              api.open({
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
              title={
                (cuotamoderadora ? "Editar" : "Crear") + " Cuota Moderadora"
              }
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {cuotamoderadora ? (
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
                      <DatosBasicos cuotamoderadora={cuotamoderadora} />
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
