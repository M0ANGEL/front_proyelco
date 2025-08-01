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
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de la version",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre de la version">
              <Input
                {...field}
                maxLength={50}
                placeholder="Nombre de la version"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {/* version */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="version"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Numero de version obligatorio",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Version de la App">
              <Input
                {...field}
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      {/* campo de prefijo de la categoria */}
      <Col xs={24} sm={ 24} style={{ width: "100%" }}>
        <Controller
          name="link_descarga"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El link de descarga es obligatorio",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Link de descarga de la APK">
              <Input
                {...field}
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