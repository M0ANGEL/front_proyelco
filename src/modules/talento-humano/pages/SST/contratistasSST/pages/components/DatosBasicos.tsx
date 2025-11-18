import { useEffect } from "react";
import { Col, Input, Row, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { Props } from "./types";
import { StyledFormItem } from "@/components/layout/styled";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("nombre", TkCategoria?.contratista);
      methods.setValue("nit", TkCategoria?.nit);
      methods.setValue("actividad", TkCategoria?.actividad);
      methods.setValue("arl", TkCategoria?.arl);
      methods.setValue("telefono", TkCategoria?.telefono);
      methods.setValue("contacto", TkCategoria?.contacto);
      methods.setValue("direccion", TkCategoria?.direccion);
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

      {/* Actividad de contratista */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="actividad"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Actividad del contratista es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Actividad del contratista">
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

      {/* arl */}
      <Col xs={24} md={12}>
        <Controller
          name="arl"
          control={methods.control}
          rules={{
            required: { value: true, message: "ARL es requerido" },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="ARL">
              <Select
                {...field}
                showSearch
                allowClear
                placeholder="Seleccione una ARL"
                options={[
                  {
                    value: "Positiva Compañía de Seguros S.A.",
                    label: "Positiva Compañía de Seguros S.A.",
                  },
                  {
                    value: "Seguros Bolívar S.A.",
                    label: "Seguros Bolívar S.A.",
                  },
                  {
                    value: "Seguros de Vida Aurora S.A.",
                    label: "Seguros de Vida Aurora S.A.",
                  },
                  {
                    value: "Liberty Seguros de Vida S.A.",
                    label: "Liberty Seguros de Vida S.A.",
                  },
                  {
                    value: "Mapfre Colombia Vida Seguros S.A.",
                    label: "Mapfre Colombia Vida Seguros S.A.",
                  },
                  {
                    value: "Colmena Seguros ARL",
                    label: "Colmena Seguros ARL",
                  },
                  {
                    value: "Seguros de Vida Alfa S.A.",
                    label: "Seguros de Vida Alfa S.A.",
                  },
                  {
                    value: "Seguros de Vida Colpatria S.A.",
                    label: "Seguros de Vida Colpatria S.A.",
                  },
                  {
                    value: "Seguros de Vida La Equidad Organismo Cooperativo",
                    label: "Seguros de Vida La Equidad Organismo Cooperativo",
                  },
                  {
                    value:
                      "ARL SURA (Compañía Suramericana de Seguros de Vida)",
                    label:
                      "ARL SURA (Compañía Suramericana de Seguros de Vida)",
                  },
                ]}
                status={error ? "error" : ""}
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

      {/* conctato de contratista */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="contacto"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "contacto del contratista es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="contacto">
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
