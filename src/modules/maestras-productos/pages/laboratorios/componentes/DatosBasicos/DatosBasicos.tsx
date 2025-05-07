/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, Row, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ laboratorio }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      laboratorio
        ? {
            descripcion: laboratorio.descripcion,
            estado_id :laboratorio.estado_id,
          }
        : {
          descripcion: null,
          estado_id: null,
          }
    );
  }, [laboratorio]);

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
                message: "Laboratorio es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Laboratorio:">
                <Input
                  {...field}
                  placeholder="Laboratorio"
                  status={error && "error"}
                  onChange={(e) => {
                    // Convertir el texto a mayúsculas antes de actualizar el valor
                    field.onChange(e.target.value.toUpperCase());
                  }}
                  value={field.value?.toUpperCase()} 
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
