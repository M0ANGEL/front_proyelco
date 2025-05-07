import { useEffect } from "react"
import { Col, Input, Row,Typography } from "antd"
import { Controller, useFormContext } from "react-hook-form"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"
import { Props } from "../DatosBasicos/types"


const { Text } = Typography

export const DatosBasicos = ({ procesos }: Props) => {
  const methods = useFormContext()

  useEffect(() => {    
    //si tenemos datos en categoria agregamos a metho los datos
    if (procesos) {
      methods.setValue('nombre_proceso', procesos?.nombre_proceso)
    } else {      
     /*  methods.setValue('estado', '1') */
    }

  }, [procesos])
  return (
    <Row gutter={24}>

      {/* campo de nombre de la categoria */}
      <Col xs={24} sm={ 24} style={{ width: "100%" }}>
        <Controller
          name="nombre_proceso"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre del procesos es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre del procesos">
              <Input
                {...field}
                maxLength={50}
                placeholder="Nombre del proceso"
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