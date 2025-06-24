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
      methods.setValue("nombre", TkCategoria?.nombre);
      methods.setValue("correo", TkCategoria?.correo);
      methods.setValue("ciudad", TkCategoria?.ciudad);
      methods.setValue("telefono", TkCategoria?.telefono);
    } else {
      /*  methods.setValue('estado', '1') */
    }
  }, [TkCategoria]);
  return (
    <Row gutter={24}>
      {/* nombre del porveedor */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de porveedor es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre de porveedor">
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

      {/* ciudad */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="ciudad"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La ciudad es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciudad">
              <Input
                {...field}
                maxLength={50}
                placeholder="Cali"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Telefono de la proveedor */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="telefono"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Telefono de proveedor es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Telefono de proveedor">
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

      {/* cuenta de correo de proveedor */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="correo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Correo de proveedor es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Correo de proveedor">
              <Input
                {...field}
                maxLength={50}
                placeholder="proveedor@gmail.com"
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
