/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import {
  Checkbox,
  Col,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import { useEffect } from "react";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ fuente }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      fuente
        ? {
            prefijo: fuente.prefijo,
            descripcion: fuente.descripcion,
            last_consec: fuente.last_consec,
            tipo_fuente: fuente.tipo_fuente,
            estado: fuente.estado,
            validate_duplicates: parseInt(fuente.validate_duplicates),
          }
        : {
            prefijo: null,
            descripcion: null,
            last_consec: null,
            tipo_fuente: null,
            estado: "1",
            validate_duplicates: 1,
          }
    );
  }, [fuente]);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="prefijo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Prefijo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Prefijo:">
                <Input
                  {...field}
                  placeholder="Prefijo"
                  maxLength={2}
                  status={error && "error"}
                  style={{ textTransform: "uppercase" }}
                  disabled={fuente ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="descripcion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Descripcion es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Descripcion:">
                <Input
                  {...field}
                  placeholder="Descripcion del cargo"
                  status={error && "error"}
                  style={{ textTransform: "uppercase" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="validate_duplicates"
            control={methods.control}
            render={({ field }) => (
              <StyledFormItem>
                <Checkbox
                  {...field}
                  checked={methods.getValues("validate_duplicates")}
                >
                  Validar duplicados
                </Checkbox>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="tipo_fuente"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo de Fuente es requerido",
              },
            }}
            defaultValue={"1"}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Tipo de Fuente:">
                <Select
                  {...field}
                  placeholder="TIPO DE FUENTE"
                  options={[
                    { value: "dispensacion", label: "DISPENSACIÓN" },
                    { value: "devolucion", label: "DEVOLUCIÓN" },
                  ]}
                  status={error && "error"}
                />
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
              <StyledFormItem required label="Estado:">
                <Select
                  {...field}
                  options={[
                    { value: "0", label: "INACTIVO" },
                    { value: "1", label: "ACTIVO" },
                  ]}
                  status={error && "error"}
                  disabled={!fuente ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="last_consec"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Último Consecutivo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Último Consecutivo:">
                <InputNumber
                  {...field}
                  min={0}
                  controls={false}
                  placeholder="ÚLTIMO CONSECUTIVO"
                  status={error && "error"}
                  style={{ width: "100%" }}
                  disabled={fuente ? true : false}
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
