import { useEffect } from "react";
import { Col, Input, Row, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("emp_nombre", TkCategoria?.emp_nombre);
      methods.setValue("nit", TkCategoria?.nit);
      methods.setValue("direccion", TkCategoria?.direccion);
      methods.setValue("telefono", TkCategoria?.telefono);
      methods.setValue("cuenta_de_correo", TkCategoria?.cuenta_de_correo);
      methods.setValue("id_user", TkCategoria?.id_user);
    } else {
      /*  methods.setValue('estado', '1') */
    }
  }, [TkCategoria]);
  return (
    <Row gutter={24}>
      {/* nombre de la empresa */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="emp_nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de la empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre de la empresa">
              <Input
                {...field}
                maxLength={50}
                placeholder="Empresa"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* direccion */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="direccion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La direccion es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Direccion">
              <Input
                {...field}
                maxLength={50}
                placeholder="Calle 2"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Telefono de la emrpesa */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="telefono"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Telefono de la empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Telefono de la empresa">
              <Input
                {...field}
                maxLength={50}
                placeholder="000 000 00 00"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* nit de la empresa */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nit"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nit de la empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nit de la empresa">
              <Input
                {...field}
                maxLength={50}
                placeholder="122301"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* cuenta de correo de la empresa */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="cuenta_de_correo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Correo de la empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Correo de la empresa">
              <Input
                {...field}
                maxLength={50}
                placeholder="cliente@gmail.com"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
