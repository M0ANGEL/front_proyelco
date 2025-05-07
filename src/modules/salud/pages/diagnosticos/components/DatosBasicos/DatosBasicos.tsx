/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Input, Radio, Row, Select, Typography } from "antd";
import { useEffect } from "react";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ diagnostico }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      diagnostico
        ? {
            codigo: diagnostico.codigo,
            descripcion: diagnostico.descripcion,
            estado: diagnostico.estado,
            has_alert: diagnostico.has_alert,
          }
        : {
            codigo: null,
            descripcion: null,
            estado: "1",
            has_alert: "0",
          }
    );
  }, [diagnostico]);
  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="codigo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "codigo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Codigo:">
                <Input
                  {...field}
                  placeholder="codigo"
                  status={error && "error"}
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
                message: "descripcion es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Descripcion:">
                <Input
                  {...field}
                  placeholder="Descripcion"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
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
                  disabled={!diagnostico ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="has_alert"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Alerta de Cuota Moderadora  es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Alerta de Cuota Moderadora:">
                <Radio.Group {...field}>
                  <Radio value="1"> Si </Radio>
                  <Radio value="0"> No </Radio>
                </Radio.Group>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
