/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Col,
  Form,
  Modal,
  Row,
  Select,
  SelectProps,
  Spin,
  notification,
  Typography,
  Input,
  Space,
  Button,
} from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import { Props } from "./types";
import { useEffect, useState } from "react";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { Controller, useForm } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { searchEntidad } from "@/services/documentos/disAPI";
import { getTiposDocumentosIdentificacion } from "@/services/maestras/tiposDocumentosIdentificacionAPI";
import { crearMedico, updateMedico } from "@/services/maestras/medicosAPI";

const { Text } = Typography;

export const ModalMedico = ({
  open,
  setOpen,
  medico,
  setMedico,
  numero_identificacion,
}: Props) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [loaderEntidades, setLoaderEntidades] = useState<boolean>(false);
  const [selectTipoEps, setSelectTipoEps] = useState<SelectProps["options"]>(
    []
  );
  const [selectTipoDocumento, setSelectTipoDocumento] = useState<
    SelectProps["options"]
  >([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const { transformToUpperCase } = useSerialize();
  const control = useForm();

  useEffect(() => {
    if (open) {
      control.reset(
        medico
          ? {
              tipo_identificacion: medico.tipo_identificacion,
              numero_identificacion: medico.numero_identificacion,
              nombre_primero: medico.nombre_primero,
              nombre_segundo: medico.nombre_segundo,
              apellido_primero: medico.apellido_primero,
              apellido_segundo: medico.apellido_segundo,
              entidad: medico.entidad,
              estado: medico.estado,
              rural: medico.rural,
            }
          : {
              tipo_identificacion: null,
              numero_identificacion: numero_identificacion,
              nombre_primero: null,
              nombre_segundo: null,
              apellido_primero: null,
              apellido_segundo: null,
              entidad: null,
              estado: "1",
              rural: "0",
            }
      );
    }
  }, [medico, open]);

  useEffect(() => {
    if (open) {
      setLoaderEntidades(true);
      searchEntidad("")
        .then(({ data: { data } }) => {
          if (data) {
            setSelectTipoEps(
              data.map((item) => ({
                value: item.entidad,
                label: `${item.entidad}`,
              }))
            );

            getTiposDocumentosIdentificacion("medicos")
              .then(({ data: { data } }) => {
                setSelectTipoDocumento(
                  data.map((item) => ({
                    value: item.codigo,
                    label: `${item.codigo} - ${item.descripcion}`,
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
          } else {
            setSelectTipoEps([]);
            notification.open({
              type: "error",
              message: "No existe la Entidad.",
            });
          }
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
        )
        .finally(() => setLoaderEntidades(false));
    }
  }, [open]);

  const onFinish = (data: any) => {
    setLoader(true);
    data = transformToUpperCase(data, [
      "nombre_primero",
      "nombre_segundo",
      "apellido_primero",
      "apellido_segundo",
      "entidad",
    ]);
    console.log(data);
    if (medico) {
      updateMedico(data, medico.id)
        .then(({ data: { data } }) => {
          setMedico(data);
          console.log(data);

          notificationApi.open({
            type: "success",
            message: "Médico actualizado con exito!",
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
        )
        .finally(() => {
          setOpen(false);
          setLoader(false);
        });
    } else {
      crearMedico(data)
        .then(({ data: { data } }) => {
          setMedico(data);
          notificationApi.open({
            type: "success",
            message: "Médico creado con exito!",
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
        )
        .finally(() => {
          setOpen(false);
          setLoader(false);
        });
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        title={`${medico ? "Editar" : "Agregar nuevo"} médico`}
        open={open}
        footer={[]}
        onCancel={() => setOpen(false)}
        onOk={() => {
          control.handleSubmit(onFinish);
        }}
        destroyOnClose={true}
        width={700}
      >
        <Spin
          spinning={loader}
          indicator={<LoadingOutlined spin />}
          style={{
            backgroundColor: "rgb(251 251 251 / 70%)",
          }}
        >
          <Form layout={"vertical"} onFinish={control.handleSubmit(onFinish)}>
            <Row gutter={24}>
              <Col span={24}>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Controller
                      name="tipo_identificacion"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "tipo de documento es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Tipo de documento:">
                          <Select
                            {...field}
                            showSearch
                            options={selectTipoDocumento}
                            placeholder={"Tipo Documento"}
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Controller
                      name="numero_identificacion"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "numero de identificacion es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          required
                          label="Numero de identificacion:"
                        >
                          <Input
                            {...field}
                            placeholder="Numero de identificacion"
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Controller
                      name="nombre_primero"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "primer nombre es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Primer nombre:">
                          <Input
                            {...field}
                            placeholder="Primer nombre"
                            status={error && "error"}
                            style={{ textTransform: "uppercase" }}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Controller
                      name="nombre_segundo"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label="Segundo nombre:">
                          <Input
                            {...field}
                            placeholder="Segundo nombre"
                            status={error && "error"}
                            style={{ textTransform: "uppercase" }}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Controller
                      name="apellido_primero"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "primer apellido es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Primer apellido:">
                          <Input
                            {...field}
                            placeholder="Primer apellido"
                            status={error && "error"}
                            style={{ textTransform: "uppercase" }}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Controller
                      name="apellido_segundo"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label="Segundo apellido:">
                          <Input
                            {...field}
                            placeholder="Segundo apellido"
                            status={error && "error"}
                            style={{ textTransform: "uppercase" }}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Controller
                      name="entidad"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "entidad es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Entidad:">
                          <Spin
                            spinning={loaderEntidades}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Select
                              {...field}
                              showSearch
                              placeholder={"Buscar eps"}
                              filterOption={(input, option) =>
                                (option?.label?.toString() ?? "")
                                  .toLowerCase()
                                  .includes(input.toString().toLowerCase())
                              }
                              notFoundContent={null}
                              options={selectTipoEps}
                              status={error && "error"}
                              style={{ textTransform: "uppercase" }}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Controller
                      name="estado"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Estado es requerido",
                        },
                      }}
                      defaultValue={"1"}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Estado">
                          <Select
                            {...field}
                            options={[
                              { value: "0", label: "INACTIVO" },
                              { value: "1", label: "ACTIVO" },
                            ]}
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Controller
                      name="rural"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Medico Rural es requerido",
                        },
                      }}
                      defaultValue={"1"}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Medico Rural">
                          <Select
                            {...field}
                            options={[
                              { value: "0", label: "No" },
                              { value: "1", label: "Si" },
                            ]}
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                span={24}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <Space>
                  <Button type="primary" danger onClick={() => setOpen(false)}>
                    Volver
                  </Button>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
