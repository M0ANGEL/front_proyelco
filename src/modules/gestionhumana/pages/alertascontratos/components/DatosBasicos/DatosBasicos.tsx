import { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd"
import { getContratosLaborales } from "@/services/gestion-humana/contratosLaboralesAPI"
import TextArea from "antd/es/input/TextArea"
import { Props } from "../types"

const { Text } = Typography

export const DatosBasicos = ({ alertaContrato }: Props) => {
  const methods = useFormContext()
  const [selectTipoContratos, setSelectTipoContratos] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    fetchTipoContratos()

    if (alertaContrato) {
      methods.setValue('dias', alertaContrato?.dias)
      methods.setValue('descripcion', alertaContrato?.descripcion)
      methods.setValue('tipo_contrato', alertaContrato?.contrato_laborale_id)
    }
  }, [alertaContrato])

  const fetchTipoContratos = () => {

    getContratosLaborales().then(({ data: { data } }) => {
      setSelectTipoContratos(
        data.map((contrato) => {
          return { label: contrato.nombre, value: contrato.id }
        })
      )
    })
  }

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="dias"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Dias para alerta es requerido",
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "Solo se permiten números",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Dias para alerta">
              <Input
                {...field}
                placeholder="Dias para alerta"
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
          name="tipo_contrato"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Tipo contrato es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo contrato">
              <Select
                {...field}
                showSearch
                allowClear
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .localeCompare(
                      (optionB?.label ?? "").toString().toLowerCase()
                    )
                }
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toString().toLowerCase())
                }
                options={selectTipoContratos}
                status={error && "error"}
                disabled={!!alertaContrato}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="descripcion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Descripción es requerido",
            }
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Descripción">
              <TextArea
                {...field}
                placeholder="Descripción"
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