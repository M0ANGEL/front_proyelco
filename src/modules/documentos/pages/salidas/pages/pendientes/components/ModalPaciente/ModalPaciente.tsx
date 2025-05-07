/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import { Props } from "./types";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import dayjs from "dayjs";
import { getCuotaModeradoras } from "@/services/maestras/cuotaModeradoraAPI";
import {
  crearPaciente,
  updatePaciente,
} from "@/services/maestras/pacientesAPI";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { searchEntidad } from "@/services/documentos/disAPI";
import { getTiposDocumentosIdentificacion } from "@/services/maestras/tiposDocumentosIdentificacionAPI";
import { getLocalidades, getPaises } from "@/services/maestras/localidadesAPI";
import { getTipoRegimen } from "@/services/maestras/tipoRegimenAPI";
import { CuotaModeradora, TipoRegimen } from "@/services/types";

const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";

export const ModalPaciente = ({
  open,
  setOpen,
  paciente,
  setPaciente,
  numero_identificacion,
  tipo_documento,
}: Props) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [loaderEntidades, setLoaderEntidades] = useState<boolean>(false);
  const [selectTipoEps, setSelectTipoEps] = useState<SelectProps["options"]>(
    []
  );
  const [selectCuotasModeradoras, setSelectCuotasModeradoras] = useState<
    SelectProps["options"]
  >([]);
  const [cuotasModeradoras, setCuotasModeradoras] =
    useState<CuotaModeradora[]>();
  const [selectTipoDocumento, setSelectTipoDocumento] = useState<
    SelectProps["options"]
  >([]);
  const [selectPaises, setSelectPaises] = useState<SelectProps["options"]>([]);
  const [selectLocalidades, setSelectLocalidades] = useState<
    SelectProps["options"]
  >([]);
  const [selectTipoRegimen, setSelectTipoRegimen] = useState<
    SelectProps["options"]
  >([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [tiposRegimen, setTiposRegimen] = useState<TipoRegimen[]>();
  const { transformToUpperCase } = useSerialize();
  const control = useForm();

  const watchRegimen = control.watch("cuota_moderadora_id");

  const disabledDate = (current: dayjs.Dayjs | null): boolean => {
    // Deshabilitar fechas posteriores al día de hoy
    return current !== null && current.isAfter(dayjs().endOf("day"));
  };

  useEffect(() => {
    if (open) {
      control.reset(
        paciente
          ? {
              tipo_identificacion: paciente.tipo_identificacion,
              numero_identificacion: paciente.numero_identificacion,
              nombre_primero: paciente.nombre_primero,
              nombre_segundo: paciente.nombre_segundo,
              apellido_primero: paciente.apellido_primero,
              apellido_segundo: paciente.apellido_segundo,
              fecha_nacimiento: dayjs(paciente.fecha_nacimiento),
              edad: paciente.edad,
              genero: paciente.genero,
              direccion: paciente.direccion,
              celular: paciente.celular,
              eps: paciente.eps_id,
              cuota_moderadora_id: paciente.cuota_moderadora_id,
              estado: paciente.estado,
              pais_origen_id: paciente.pais_origen_id,
              localidad_id: paciente.localidad_id,
              tipo_regimen_id: paciente.tipo_regimen_id,
            }
          : {
              tipo_identificacion: tipo_documento,
              numero_identificacion: numero_identificacion,
              nombre_primero: null,
              nombre_segundo: null,
              apellido_primero: null,
              apellido_segundo: null,
              fecha_nacimiento: null,
              edad: null,
              genero: null,
              direccion: null,
              celular: null,
              eps: null,
              cuota_moderadora_id: null,
              estado: "1",
              pais_origen_id: null,
              localidad_id: null,
              tipo_regimen_id: null,
            }
      );
    }
  }, [paciente, open]);

  useEffect(() => {
    if (open) {
      getCuotaModeradoras()
        .then(({ data: { data } }) => {
          const cuotas: SelectProps["options"] = [];
          data.forEach((item) => {
            if (["1", 1].includes(item.estado)) {
              cuotas.push({
                label: `${item.regimen.toUpperCase()} ${
                  !["SUBSIDIADO", "ESPECIAL"].includes(
                    item.regimen.toUpperCase()
                  )
                    ? ` - Categoria ${item.categoria} ($ ${parseFloat(
                        item.valor
                      ).toLocaleString("COP")})`
                    : ""
                }`,
                value: item.id.toString(),
              });
            }
          });

          setCuotasModeradoras(data);
          setSelectCuotasModeradoras(cuotas);
          setLoaderEntidades(true);
          searchEntidad("")
            .then(({ data: { data } }) => {
              if (data) {
                setSelectTipoEps(
                  data.map((item) => ({
                    value: item.id.toString(),
                    label: `${item.entidad}`,
                  }))
                );

                getTiposDocumentosIdentificacion("pacientes")
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

      getPaises()
        .then(({ data: { data } }) => {
          setSelectPaises(
            data.map((item) => ({
              value: item.id.toString(),
              label: `${item.abreviatura2} - ${item.nombre}`,
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

      getLocalidades()
        .then(({ data: { data } }) => {
          setSelectLocalidades(
            data.map((item) => ({
              value: item.id.toString(),
              label: `${item.municipio} - ${item.departamento}`,
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
      getTipoRegimen()
        .then(({ data: { data } }) => {
          setTiposRegimen(data);
          // setSelectTipoRegimen(
          //   data.map((item) => ({
          //     value: item.id.toString(),
          //     label: `${item.nombre}`,
          //   }))
          // );
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
  }, [open]);

  useEffect(() => {
    const fecha = dayjs(control.getValues("fecha_nacimiento"));
    const now = dayjs(new Date());
    const edad = fecha.diff(now, "year") * -1;
    control.setValue("edad", edad);
  }, [control.watch("fecha_nacimiento")]);

  useEffect(() => {
    if (watchRegimen && tiposRegimen && cuotasModeradoras) {
      const regimen = cuotasModeradoras.find(
        (item) => item.id.toString() == watchRegimen
      );
      if (regimen) {
        const options = tiposRegimen
          .filter((item) =>
            JSON.parse(regimen.tipo_regimen).includes(item.id.toString())
          )
          .map((item) => ({
            value: item.id.toString(),
            label: item.nombre,
          }));
        setSelectTipoRegimen(options);
      } else {
        setSelectTipoRegimen([]);
      }
    }
  }, [watchRegimen, tiposRegimen, cuotasModeradoras, paciente]);

  const onFinish: SubmitHandler<any> = (data) => {
    data = transformToUpperCase(data, [
      "nombre_primero",
      "nombre_segundo",
      "apellido_primero",
      "apellido_segundo",
      "eps",
    ]);
    setLoader(true);
    if (paciente) {
      updatePaciente(data, paciente.id)
        .then(({ data: { data } }) => {
          setPaciente(data);
          notificationApi.open({
            type: "success",
            message: "Paciente actualizado con exito!",
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
      crearPaciente(data)
        .then(({ data: { data } }) => {
          setPaciente(data);
          notificationApi.open({
            type: "success",
            message: "Paciente creado con exito!",
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
        title={`${paciente ? "Editar" : "Agregar nuevo"} paciente`}
        open={open}
        footer={[]}
        onCancel={() => setOpen(false)}
        onOk={() => {
          control.handleSubmit(onFinish);
        }}
        destroyOnClose={true}
        style={{ top: 10 }}
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
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} style={{ width: "100%" }}>
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
                        options={selectTipoDocumento}
                        showSearch
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
                    <StyledFormItem required label="Numero de identificacion:">
                      <Input
                        {...field}
                        placeholder="Numero de identificacion"
                        status={error && "error"}
                        disabled={paciente ? true : false}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
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
                <Controller
                  name="fecha_nacimiento"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "fecha nacimiento es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Fecha nacimiento:">
                      <DatePicker
                        {...field}
                        status={error && "error"}
                        style={{ width: "100%" }}
                        defaultValue={dayjs("01-01-2000", dateFormat)}
                        format={dateFormat}
                        disabledDate={disabledDate}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="edad"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "edad es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Edad:">
                      <Input
                        {...field}
                        placeholder="Edad"
                        status={error && "error"}
                        disabled
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={24} sm={12} style={{ width: "100%" }}>
                <Controller
                  name="pais_origen_id"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Nacionalidad es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Nacionalidad:">
                      <Select
                        {...field}
                        options={selectPaises}
                        showSearch
                        placeholder={"Nacionalidad"}
                        filterOption={(input, option) =>
                          (option?.label?.toString() ?? "")
                            .toLowerCase()
                            .includes(input.toString().toLowerCase())
                        }
                        notFoundContent={null}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="genero"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "genero es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Genero:">
                      <Select
                        {...field}
                        options={[
                          { value: "M", label: "MASCULINO" },
                          { value: "F", label: "FEMENINO" },
                        ]}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="direccion"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Direccion es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Direccion:">
                      <Input
                        {...field}
                        placeholder="Direccion"
                        status={error && "error"}
                        style={{ textTransform: "uppercase" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="localidad_id"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Municipio Residencia es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Municipio Residencia:">
                      <Select
                        {...field}
                        options={selectLocalidades}
                        showSearch
                        placeholder={"Municipio Residencia"}
                        filterOption={(input, option) =>
                          (option?.label?.toString() ?? "")
                            .toLowerCase()
                            .includes(input.toString().toLowerCase())
                        }
                        notFoundContent={null}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="celular"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "celular es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Celular:">
                      <Input
                        {...field}
                        placeholder="Celular"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="eps"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "EPS es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="EPS:">
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
                <Controller
                  name="cuota_moderadora_id"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "cuota moderadora es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Cuota moderadora:">
                      <Select
                        {...field}
                        placeholder={"CUOTA MODERADORA"}
                        popupMatchSelectWidth={false}
                        options={selectCuotasModeradoras}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />

                <Controller
                  name="tipo_regimen_id"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Tipo Regimen es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Tipo Regimen:">
                      <Select
                        {...field}
                        options={selectTipoRegimen}
                        status={error && "error"}
                        placeholder="Tipo Regimen"
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
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "center" }}
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
