/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Input, Row, Select, Typography } from "antd";
import { useEffect } from "react";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ concepto }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      concepto
        ? {
            descripcion: concepto.descripcion,
            estado: concepto.estado,
          }
        : {
            descripcion: null,
            estado: "1",
          }
    );
  }, [concepto]);
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
                message: "Concepto es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Concepto:">
                <Input
                  {...field}
                  placeholder="Concepto"
                  status={error && "error"}
                  style={{ textTransform: "uppercase" }}
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
                  disabled={!concepto ? true : false}
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
