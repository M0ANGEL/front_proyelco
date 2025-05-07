import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"
import { Col, Input, Row, Select, Spin, Typography } from "antd"
import { Controller, useFormContext } from "react-hook-form"
import { LoadingOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { Props } from "../types"


const { Text } = Typography

export const DatosBasicos = ({ cajaCompensacion }: Props) => {

  const methods = useFormContext()
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false)

  useEffect(() => {

    if (cajaCompensacion) {
      methods.setValue('nombre', cajaCompensacion?.nombre)
      methods.setValue('estado', cajaCompensacion?.estado)
    } else {
      methods.setValue('estado', '1')
    }

  }, [cajaCompensacion]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de caja de compensación es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre de caja de compensación">
              <Input
                {...field}
                placeholder="Nombre de caja de compensación"
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
          name="estado"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Estado requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Estado">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
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
                  options={[
                    { value: "0", label: "INACTIVO" },
                    { value: "1", label: "ACTIVO" },
                  ]}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  )
}