import { useEffect } from "react"
import { Col, Row, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"

import { Props } from "../DatosBasicos/types"
import TextArea from "antd/es/input/TextArea"


const { Text } = Typography

export const DatosBasicos = ({ TkPreguntas }: Props) => {
  const methods = useFormContext()


  useEffect(() => {    
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkPreguntas) {
      methods.setValue('created_at', TkPreguntas?.created_at)
      methods.setValue('pregunta', TkPreguntas?.pregunta)
      methods.setValue('tipo', TkPreguntas?.tipo)
    } else {      
     /*  methods.setValue('estado', '1') */
    }

  }, [TkPreguntas])
  return (
    <Row gutter={24}>

       {/* campo de area string **/}
       <Col xs={24} sm={4} style={{ width: "100%" }}>
        <Controller
          name="tipo"
          control={methods.control}
          rules={{
            required: {
              value: false,
              message: "Tipo de pregunta es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo de pregunta">
                <Select
                  {...field}
                  showSearch
                  allowClear
                  value={"3"}
                  disabled
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
                  options={[
                   /*  { value: "1", label: "Respuesta Libre" },
                    { value: "2", label: " SI | NO" }, */
                    { value: "3", label: " Estrellas" },
                  ]}
                  status={error && "error"}
                />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* campo de nombre de la pregunta */}
      <Col xs={24} sm={20} style={{ width: "100%" }}>
        <Controller
          name="pregunta"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La pregunta es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Pregunta para calificaiones">
              <TextArea
                {...field}
                maxLength={250}
                status={error && "error"}
                rows={1}
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