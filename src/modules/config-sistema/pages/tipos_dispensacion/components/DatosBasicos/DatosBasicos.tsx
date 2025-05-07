/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Input, Row, Typography } from "antd";
import { useEffect } from "react";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ tipoDispensacion }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      tipoDispensacion
        ? {
            descripcion: tipoDispensacion.descripcion,
          }
        : {
            descripcion: null,
          }
    );
  }, [tipoDispensacion]);
  return (
    <>
      <Row gutter={12}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="descripcion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Descripción es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Descripción:">
                <Input
                  {...field}
                  placeholder="Descripción del documento"
                  status={error && "error"}
                  maxLength={60}
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
