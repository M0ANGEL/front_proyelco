import { Controller, useFormContext } from "react-hook-form"
import { Col, Input, Row, Typography } from "antd"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"

const { Text } = Typography;

export const DatosBasicos = () => {
  const methods = useFormContext()

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de fondo de cesantias es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre fondo de cesantias">
              <Input
                {...field}
                placeholder="Nombre fondo de cesantias"
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