import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Input, Row, Spin, Typography } from "antd"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "../types";
import TextArea from "antd/es/input/TextArea";



const { Text } = Typography;

export const DatosBasicos = ({ porcentaje }: Props) => {
  const [hasDias, setHasDias] = useState<boolean>(false);
  const methods = useFormContext();

  useEffect(() => {

    if (porcentaje) {
      methods.setValue('porcentaje', porcentaje?.porcentaje)
      methods.setValue('tipoIncapacidad', porcentaje?.tipo_incapacidad)
      methods.setValue('articulo', porcentaje?.articulo)
      methods.setValue('dias', porcentaje?.dias)

      if (porcentaje.tipo_incapacidad == 'ACCIDENTE DE TRANSITO' || 
        porcentaje.tipo_incapacidad == 'COMUN' || 
        porcentaje.tipo_incapacidad == 'LABORAL') {
        setHasDias(true);
      }
    }
  }, [porcentaje]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="tipoIncapacidad"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Tipo incapacidad requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo Incapacidad">
              <Input
                {...field}
                placeholder="Tipo incapacidad"
                disabled
                type="text"
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
          name="porcentaje"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Porcentaje",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Porcentaje">
              <Input
                {...field}
                placeholder="Porcentaje"
                type="number"
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
          name="dias"
          control={methods.control}
          // rules={{
          //   required: {
          //     value: true,
          //     message: "Tipo incapacidad requerido",
          //   },
          // }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Días">
              <Input
                {...field}
                disabled={hasDias}
                placeholder="Días"
                type="text"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
                onKeyDown={(event) => {
                  // Permitir solo teclas numéricas
                  if (!/[0-9]/.test(event.key) && event.key !== "Backspace" && event.key !== "Delete") {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const { value } = e.target;
                  // Permitir solo números
                  if (/^[0-9]*$/.test(value)) {
                    field.onChange(value); // Actualiza el valor en el controlador
                  }
                }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="articulo"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Artículo">
              <TextArea
                {...field}
                placeholder="Artículo"
                status={error && "error"}
                autoSize={{ minRows: 4, maxRows: 6 }}
                maxLength={250}
                showCount
              />

              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  )
}