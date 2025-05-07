/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMotivosAud } from "@/services/maestras/motivosAuditoriaAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { AudObservacion } from "@/services/types";
import {
  getAudObservacionInfo,
  updateAudObservacion,
  crearAudObservacion,
} from "@/services/maestras/audObservacionesAPI";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  notification,
  SelectProps,
  Typography,
  Button,
  Select,
  Space,
  Form,
  Spin,
  Col,
  Row,
} from "antd";
import { CustomSelect } from "@/modules/common/components/CustomSelect/CustomSelect";

const { Text } = Typography;

export const FormObservacionesAud = () => {
  const [motivosSelect, setMotivosSelect] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [observacion, setObservacion] = useState<AudObservacion>();
  const [loader, setLoader] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const control = useForm<{
    aud_observacion: string;
    estado: number;
    aud_motivos: number[];
  }>({
    defaultValues: { aud_observacion: "", estado: 1, aud_motivos: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await getAudObservacionInfo(id)
          .then(({ data: { data } }) => {
            setObservacion(data);
            control.reset({
              aud_observacion: data.aud_observacion,
              aud_motivos: JSON.parse(data.aud_motivos),
              estado: parseInt(data.estado),
            });
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
            }
          );
      }

      await getMotivosAud()
        .then(({ data: { data } }) => {
          setMotivosSelect(
            data
              .filter((item) => item.estado == "1")
              .map((motivo) => ({
                value: motivo.id,
                label: `${motivo.codigo} - ${motivo.motivo}`,
              }))
          );
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
          }
        );
    };
    fetchData().finally(() => setLoader(false));
  }, [id]);

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    if (observacion) {
      updateAudObservacion(data, id)
        .then(() => {
          notificationApi.success({
            message: "Observacion actualizada con exito!",
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
            setLoader(false);
          }
        );
    } else {
      crearAudObservacion(data)
        .then(() => {
          notificationApi.success({ message: "Observacion creada con exito!" });
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
            setLoader(false);
          }
        );
    }
  };

  return (
    <>
      {contextHolder}
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        <Form
          layout="vertical"
          onFinish={control.handleSubmit(onFinish)}
          autoComplete="off"
          onKeyDown={(e: any) => checkKeyDown(e)}
        >
          <StyledCard
            title={`${id ? "Editar" : "Crear"} Observación`}
            extra={
              <Space>
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<SaveOutlined />}
                >
                  Guardar
                </Button>
                <Link to={observacion ? "../.." : ".."} relative="path">
                  <Button danger type="primary" icon={<ArrowLeftOutlined />}>
                    Volver
                  </Button>
                </Link>
              </Space>
            }
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Controller
                  name="aud_observacion"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Descripción (Observación) es necesaria",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Descripción (Observación):">
                      <TextArea
                        {...field}
                        showCount
                        maxLength={150}
                        autoSize={{ minRows: 4, maxRows: 6 }}
                        placeholder="Descripción (Observación):"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Controller
                  name="aud_motivos"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Motivos es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Motivos:">
                      <CustomSelect
                        {...field}
                        mode="multiple"
                        maxTagCount={2}
                        listHeight={400}
                        placeholder="Seleccionar Motivo(s)"
                        options={motivosSelect}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="estado"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Estado es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Estado:">
                      <Select
                        {...field}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={[
                          { value: 0, label: "INACTIVO" },
                          { value: 1, label: "ACTIVO" },
                        ]}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            </Row>
          </StyledCard>
        </Form>
      </Spin>
    </>
  );
};
