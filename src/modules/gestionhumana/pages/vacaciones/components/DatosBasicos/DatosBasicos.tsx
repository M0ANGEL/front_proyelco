import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Col, DatePicker, Input, Row, Select, Spin, Typography } from "antd";
import { Props } from "./types";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";

const { RangePicker } = DatePicker;

export const DatosBasicos = ({
  selectEmpleado,
  selectTipoCarta,
  vacacion,
}: Props) => {
  const methods = useFormContext();
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true);
  const [cartaSeleccionada, setCartaSeleccionada] = useState("");
  const watchTipoCarta = methods.watch("tipoCarta");

  useEffect(() => {
    if (vacacion) {
      methods.setValue("empleado", vacacion.empleado_id);
      methods.setValue("tipoCarta", vacacion.tipo_vacaciones);
      setCartaSeleccionada(vacacion.tipo_vacaciones);
    } else {
      methods.reset();
    }
    setLoaderEmp(false);
  }, [vacacion]);

  useEffect(() => {
    if (vacacion && watchTipoCarta) {
      methods.setValue("fecha_inicio", dayjs(vacacion.fecha_inicio));
      methods.setValue("fecha_fin", dayjs(vacacion.fecha_fin));
      methods.setValue("fecha_reintegro", dayjs(vacacion.fecha_reintegro));
      methods.setValue("dias_vacaciones", parseInt(vacacion.dias_vacaciones));
      methods.setValue("dias_compensados", parseInt(vacacion.dias_compensados));

      if (vacacion.periodo_inicio && vacacion.periodo_fin) {
        methods.setValue("periodo_fecha", [
          dayjs(vacacion.periodo_inicio),
          dayjs(vacacion.periodo_fin),
        ]);
      } else {
        methods.setValue("periodo_fecha", null);
      }
    }
  }, [vacacion, watchTipoCarta]);

  useEffect(() => {
    if (cartaSeleccionada === "CARTA VACACIONES COMPENSADAS") {
      if (vacacion?.periodo_inicio && vacacion?.periodo_fin) {
        methods.setValue("periodo_fecha", [
          dayjs(vacacion?.periodo_inicio),
          dayjs(vacacion?.periodo_fin),
        ]);
      } else {
        methods.setValue("periodo_fecha", null);
      }
    }

    if (cartaSeleccionada === 'CARTA VACACIONES') {
      methods.setValue('dias_vacaciones', 15);
    }
  }, [cartaSeleccionada, vacacion]);

  const diasVacaciones = () => {
    return (
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="dias_vacaciones"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Dias vacaciones es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Dias vacaciones">
              <Input
                {...field}
                ref={field.ref}
                placeholder="Dias vacaciones"
                maxLength={80}
                status={error && "error"}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  field.onChange(value);
                }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    );
  };

  const addCamposPorTipoDeCarta = () => {
    if (cartaSeleccionada === "CARTA VACACIONES COMPENSADAS") {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }}>
          <Controller
            control={methods.control}
            name="periodo_fecha"
            rules={{
              required: {
                value: true,
                message: "Periodo es necesario",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label={"Periodo:"}>
                <RangePicker
                  {...field}
                  placeholder={["Inicio", "Fin"]}
                  status={error && "error"}
                  style={{ width: "100%" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      );
    } else if (cartaSeleccionada === "CARTA VACACIONES MITA COMPENSADAS") {
      return (
        <>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_inicio"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha inicio es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha inicio">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha inicio"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_fin"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha fin es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha fin">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha fin"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_reintegro"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha reintegro es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha reintegro">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha reintegro"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          {diasVacaciones()}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="dias_compensados"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Dias compensados es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Dias compensados">
                  <Input
                    {...field}
                    placeholder="Dias compensados"
                    maxLength={80}
                    status={error && "error"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(value);
                    }}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }}>
            <Controller
              control={methods.control}
              name="periodo_fecha"
              rules={{
                required: {
                  value: true,
                  message: "Periodo es necesario",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label={"Periodo:"}>
                  <RangePicker
                    {...field}
                    placeholder={["Inicio", "Fin"]}
                    status={error && "error"}
                    style={{ width: "100%" }}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        </>
      );
    } else {
      return (
        <>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_inicio"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha inicio es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha inicio">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha inicio"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_fin"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha fin es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha fin">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha fin"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_reintegro"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha reintegro es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha reintegro">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha reintegro"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }}>
            <Controller
              control={methods.control}
              name="periodo_fecha"
              rules={{
                required: {
                  value: true,
                  message: "Periodo es necesario",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label={"Periodo:"}>
                  <RangePicker
                    {...field}
                    placeholder={["Inicio", "Fin"]}
                    status={error && "error"}
                    style={{ width: "100%" }}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          {diasVacaciones()}
        </>
      );
    }
  };

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="empleado"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Empleado es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Empleado">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selectEmpleado}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="tipoCarta"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Tipo carta es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo carta">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selectTipoCarta}
                  status={error && "error"}
                  onChange={(value) => {
                    field.onChange(value); // Actualiza el valor del formulario
                    setCartaSeleccionada(value); // Actualiza el estado con el contrato seleccionado
                  }}
                  // onSelect={(value) => {
                  //   if (value == "CARTA VACACIONES") {
                  //     methods.setValue("dias_vacaciones", 15);
                  //   } 
                  // }}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {addCamposPorTipoDeCarta()}
    </Row>
  );
};
