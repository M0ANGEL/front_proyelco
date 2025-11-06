import { useEffect } from "react"
import { Col, Input, Row, Typography } from "antd"
import { Controller, useFormContext } from "react-hook-form"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"
import { Props } from "../DatosBasicos/types"


const { Text } = Typography

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext()

  useEffect(() => {    
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue('created_at', TkCategoria?.created_at)
      methods.setValue('name', TkCategoria?.name)
      methods.setValue('prefijo', TkCategoria?.prefijo)
      methods.setValue('estado', TkCategoria?.estado)
    } else {      
     /*  methods.setValue('estado', '1') */
    }

  }, [TkCategoria])
  return (
    <Row gutter={24}>

      {/* campo de nombre de la categoria */}
      <Col xs={24} sm={ TkCategoria ? 8 : 12} style={{ width: "100%" }}>
        <Controller
          name="name"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre categoria es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre de categoria">
              <Input
                {...field}
                maxLength={50}
                placeholder="Nombre de categoria"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {/* campo de prefijo de la categoria */}
      <Col xs={24} sm={ TkCategoria ? 8 : 12} style={{ width: "100%" }}>
        <Controller
          name="prefijo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El prefijo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Prefijo">
              <Input
                {...field}
                maxLength={5}
                placeholder="Prefijo"
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