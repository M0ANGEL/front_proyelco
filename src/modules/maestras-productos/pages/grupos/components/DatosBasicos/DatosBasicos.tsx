/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, Row, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ grupo }: Props) => {
  const methods = useFormContext();
  useEffect(() => {
    methods.reset(
      grupo
        ? {
            descripcion: grupo.descripcion,
          }
        : {
            descripcion: null,
          }
    );
  }, [grupo]);

  return (
    <>
      <Row gutter={24}>
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
                  placeholder="Descripción"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}></Col>
      </Row>
    </>
  );
};
