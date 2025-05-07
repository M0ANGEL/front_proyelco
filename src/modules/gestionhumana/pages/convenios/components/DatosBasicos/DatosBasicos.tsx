import { useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"
import { Col, Input, Row, Typography } from "antd"
import { Props } from "../types"
import TextArea from "antd/es/input/TextArea"

const { Text } = Typography

export const DatosBasicos = ({ rhConvenio }: Props) => {
  const methods = useFormContext()

  useEffect(() => {

    methods.reset(
      rhConvenio
        ? {
          nombre: rhConvenio.nombre_convenio,
          numero_contrato: rhConvenio.numero_contrato,
          objeto: rhConvenio.objeto
        }
        : {
          nombre: null,
          numero_contrato: null,
        }
    )
  }, [rhConvenio])

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de convenio es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre convenio">
              <Input
                {...field}
                maxLength={200}
                placeholder="Nombre Convenio"
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
          name="numero_contrato"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Número contrato es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Numero contrato">
              <Input
                {...field}
                placeholder="Numero contrato"
                maxLength={80}
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
          name="objeto"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Objeto es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Objeto">
              <TextArea
                {...field}
                placeholder="Objeto"
                status={error && "error"}
                autoSize={{ minRows: 4, maxRows: 6 }}
                maxLength={1000}
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