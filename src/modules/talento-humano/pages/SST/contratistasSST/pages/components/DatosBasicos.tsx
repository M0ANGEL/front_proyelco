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
      methods.setValue("direccion", TkCategoria?.direccion);
      methods.setValue("nombre", TkCategoria?.nombre);
      methods.setValue("nit", TkCategoria?.nit);
      methods.setValue("telefono", TkCategoria?.telefono);
      methods.setValue("correo", TkCategoria?.correo);
    } else {
      /*  methods.setValue('estado', '1') */
    }
  }, [TkCategoria]);
  return (
    <Row gutter={24}>
      {/* nombre de contratista */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre del contratista es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre del contratista">
              <Input
                {...field}
                maxLength={50}
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* nit de contratista */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nit"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nit del contratista es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nit del contratista">
              <Input
                {...field}
                maxLength={50}
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* telefono de contratista */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="telefono"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "telefono del contratista es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="telefono">
              <Input
                {...field}
                maxLength={50}
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* direccion de contratista */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="direccion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Direccion del contratista es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Direccion del contratista">
              <Input
                {...field}
                maxLength={50}
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* correo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="correo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El correo  es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Correo">
              <Input
                {...field}
                maxLength={50}
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
