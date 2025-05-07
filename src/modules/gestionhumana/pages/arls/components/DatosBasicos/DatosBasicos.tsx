
import { Col, Input, Row, Typography } from "antd"
import { Props } from "../types"
import { Controller, useFormContext } from "react-hook-form"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"
import { useEffect } from "react"

const { Text } = Typography

export const DatosBasicos = ({ arl }: Props) => {
  const methods = useFormContext()

  useEffect(() => {

    methods.reset({
      nombre: arl?.nombre || "",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arl])

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre ARL es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre ARL">
              <Input
                maxLength={80}
                {...field}
                placeholder="Nombre ARL"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  )
}