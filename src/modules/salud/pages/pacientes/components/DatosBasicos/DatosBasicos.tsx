/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { getTiposDocumentosIdentificacion } from "@/services/maestras/tiposDocumentosIdentificacionAPI";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getLocalidades, getPaises } from "@/services/maestras/localidadesAPI";
import { getCuotaModeradoras } from "@/services/maestras/cuotaModeradoraAPI";
import { getEntidades } from "@/services/maestras/entidadesAPI";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Props } from "./types";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  InputNumber,
  DatePicker,
  Typography,
  Select,
  Input,
  Col,
  Row,
  Spin,
  Alert,
} from "antd";
import { getTipoRegimen } from "@/services/maestras/tipoRegimenAPI";
import { reglasDocumento } from "@/modules/common/constants/constants";
import { CuotaModeradora, TipoRegimen } from "@/services/types";

dayjs.extend(customParseFormat);

const dateFormat = "DD/MM/YYYY";
const { Text } = Typography;

export const DatosBasicos = ({
  paciente,
  hasFuente,
  setAlertaButton,
}: Props) => {
  const [selectPaises, setSelectPaises] = useState<SelectProps["options"]>([]);
  const [selectTipo, setSelectTipo] = useState<SelectProps["options"]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderSelects, setLoaderSelects] = useState<boolean>(false);
  const [tiposRegimen, setTiposRegimen] = useState<TipoRegimen[]>();
  const [cuotasModeradoras, setCuotasModeradoras] =
    useState<CuotaModeradora[]>();
  const [selectTipoDocumento, setSelectTipoDocumento] = useState<
    SelectProps["options"]
  >([]);
  const [alertaEdad, setAlertaEdad] = useState<boolean>(false);
  const [selectTipoRegimen, setSelectTipoRegimen] = useState<
    SelectProps["options"]
  >([]);
  const [selectLocalidades, setSelectLocalidades] = useState<
    SelectProps["options"]
  >([]);
  const [selectCuotasModeradoras, setSelectCuotasModeradoras] = useState<
    SelectProps["options"]
  >([]);

  const methods = useFormContext();

  const watchEdad = methods.watch("edad");
  const watchTipoDocumento = methods.watch("tipo_identificacion");
  const watchRegimen = methods.watch("cuota_moderadora_id");

  const disabledDate = (current: dayjs.Dayjs | null): boolean => {
    return current !== null && current.isAfter(dayjs().endOf("day"));
  };

  const validar = (edad: any, tipo_doc: any, hasFuente: any) => {
    if (edad >= 0 && edad != null && !hasFuente) {
      const regla = reglasDocumento[tipo_doc as keyof typeof reglasDocumento];
      if (!regla || edad < regla.min || edad > regla.max) {
        setAlertaEdad(true);
        setAlertaButton(true);
      } else {
        setAlertaEdad(false);
        setAlertaButton(false);
      }
    } else {
      setAlertaEdad(false);
      setAlertaButton(false);
    }
  };

  useEffect(() => {
    validar(watchEdad, watchTipoDocumento, hasFuente);
  }, [
    watchEdad,
    watchTipoDocumento,
    methods.watch("fecha_nacimiento"),
    hasFuente,
  ]);

  useEffect(() => {
    const fecha = dayjs(methods.getValues("fecha_nacimiento"));
    const now = dayjs(new Date());
    const edad = fecha.diff(now, "year") * -1;
    methods.setValue("edad", edad);
  }, [methods.watch("fecha_nacimiento")]);

  useEffect(() => {
    setLoaderSelects(true);
    const fetchSelects = async () => {
      await getCuotaModeradoras()
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
      await getEntidades()
        .then(({ data: { data } }) => {
          setSelectTipo(
            data.map((item) => ({
              value: item.id.toString(),
              label: `${item.entidad}`,
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

      await getTiposDocumentosIdentificacion("pacientes")
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

      await getPaises()
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

      await getLocalidades()
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

      await getTipoRegimen()
        .then(({ data: { data } }) => {
          setTiposRegimen(data);
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

    fetchSelects()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoaderSelects(false));
  }, []);

  useEffect(() => {
    methods.reset(
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
            celular: parseInt(paciente.celular),
            eps: paciente.eps_id,
            cuota_moderadora_id: paciente.cuota_moderadora_id,
            estado: paciente.estado,
            pais_origen_id: paciente.pais_origen_id,
            localidad_id: paciente.localidad_id,
            tipo_regimen_id: paciente.tipo_regimen_id,
            correo: paciente.correo,
          }
        : {
            tipo_identificacion: null,
            numero_identificacion: null,
            nombre_primero: null,
            nombre_segundo: null,
            apellido_primero: null,
            apellido_segundo: null,
            fecha_nacimiento: null,
            edad: null,
            genero: null,
            direccion: hasFuente ? "N/A" : null,
            celular: hasFuente ? "0" : null,
            eps: hasFuente ? "198" : null,
            cuota_moderadora_id: hasFuente ? "4" : null,
            estado: "1",
            pais_origen_id: hasFuente ? "48" : null,
            localidad_id: hasFuente ? "1027" : null,
            tipo_regimen_id: hasFuente ? "4" : null,
            correo: null,
          }
    );
  }, [paciente, hasFuente]);

  useEffect(() => {
    if (watchRegimen && tiposRegimen && cuotasModeradoras) {
      if (hasFuente) {
        setSelectTipoRegimen(
          tiposRegimen.map((item) => ({
            value: item.id.toString(),
            label: item.nombre,
          }))
        );
        return;
      }
      if (!paciente) {
        methods.setValue("tipo_regimen_id", undefined);
      }

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
  }, [watchRegimen, tiposRegimen, cuotasModeradoras, hasFuente, paciente]);

  return (
    <>
      {contextHolder}
      <Row gutter={24}>
        {alertaEdad ? (
          <Col span={24}>
            <Alert
              message="La edad ingresada no corresponde al Tipo de Documento seleccionado"
              type="error"
            />
          </Col>
        ) : null}
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="tipo_identificacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo de documento es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Tipo de documento:">
                <Spin
                  spinning={loaderSelects}
                  style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
                >
                  <Select
                    {...field}
                    options={selectTipoDocumento}
                    status={error && "error"}
                    showSearch
                    placeholder={"Tipo Documento"}
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toString().toLowerCase())
                    }
                    notFoundContent={null}
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="numero_identificacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Número de identificación es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Número de identificación:">
                <Input
                  {...field}
                  placeholder="Número de identificación"
                  status={error && "error"}
                  disabled={paciente ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="nombre_primero"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Primer nombre es requerido",
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
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="Segundo nombre:">
                <Input
                  {...field}
                  placeholder="Segundo nombre"
                  status={error && "error"}
                  style={{ textTransform: "uppercase" }}
                />
              </StyledFormItem>
            )}
          />
          <Controller
            name="apellido_primero"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Primer apellido es requerido",
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
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="Segundo apellido:">
                <Input
                  {...field}
                  placeholder="Segundo apellido"
                  status={error && "error"}
                  style={{ textTransform: "uppercase" }}
                />
              </StyledFormItem>
            )}
          />
          <Controller
            name="fecha_nacimiento"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha nacimiento es requerido",
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
                  placeholder="Fecha Nacimiento"
                  disabledDate={disabledDate}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="edad"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Edad es requerido",
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
          <Controller
            name="correo"
            control={methods.control}
            rules={{
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Ingrese un correo válido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="Correo:">
                <Input
                  {...field}
                  placeholder="Correo"
                  status={error && "error"}
                  maxLength={255}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="pais_origen_id"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Nacionalidad es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Nacionalidad:">
                <Spin
                  spinning={loaderSelects}
                  style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
                >
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
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="genero"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Género es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Género:">
                <Select
                  {...field}
                  options={[
                    { value: "M", label: "MASCULINO" },
                    { value: "F", label: "FEMENINO" },
                    { value: "I", label: "INDETERMINADO o INTERSEXUAL" },
                  ]}
                  status={error && "error"}
                  placeholder="Género"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="direccion"
            control={methods.control}
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
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Municipio Residencia es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Municipio Residencia:">
                <Spin
                  spinning={loaderSelects}
                  style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
                >
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
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="celular"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Celular es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Celular:">
                <InputNumber
                  {...field}
                  controls={false}
                  min={0}
                  placeholder="Celular"
                  status={error && "error"}
                  style={{ width: "100%" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="eps"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "EPS es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="EPS:">
                <Spin
                  spinning={loaderSelects}
                  style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
                >
                  <Select
                    {...field}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toString().toLowerCase())
                    }
                    placeholder={"Buscar eps"}
                    notFoundContent={null}
                    options={selectTipo}
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
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Regimen es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Regimen:">
                <Spin
                  spinning={loaderSelects}
                  style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
                >
                  <Select
                    {...field}
                    options={selectCuotasModeradoras}
                    status={error && "error"}
                    placeholder="Regimen"
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="tipo_regimen_id"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo Regimen es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Tipo Regimen:">
                <Spin
                  spinning={loaderSelects}
                  style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
                >
                  <Select
                    {...field}
                    options={selectTipoRegimen}
                    status={error && "error"}
                    placeholder="Tipo Regimen"
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="estado"
            control={methods.control}
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
                  disabled={!paciente ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
