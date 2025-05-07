import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Col,
  Input,
  Row,
  Typography,
} from "antd";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "../types";

const { Text } = Typography;
export const DatosBasicos = ({ dotacion }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    if (dotacion) {
      methods.setValue("tipo", dotacion.tipo);
      methods.setValue("talla", dotacion.talla);
      methods.setValue("stock", dotacion.stock);
    } else {
      methods.reset();
    }
  }, [dotacion]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="tipo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Tipo dotación es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo dotación">
              <Input
                {...field}
                maxLength={20}
                placeholder="Tipo dotación"
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
          name="talla"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Talla es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Talla">
              <Input
                {...field}
                maxLength={20}
                placeholder="Talla"
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
          name="stock"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Stock es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Stock">
              <Input
                {...field}
                maxLength={20}
                placeholder="Stock"
                status={error && "error"}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); 
                  field.onChange(value);
                }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
