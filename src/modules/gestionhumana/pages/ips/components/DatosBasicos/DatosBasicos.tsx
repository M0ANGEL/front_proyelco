import { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"
import { LoadingOutlined } from "@ant-design/icons";
import { getLocalidades } from "@/services/maestras/localidadesAPI"
import { Props } from "../types"

const { Text } = Typography

export const DatosBasicos = ({ ips }: Props) => {
  const methods = useFormContext()
  const [selectLocalidad, setSelectLocalidad] = useState<SelectProps["options"]>([])
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true);


  const fetchLocalidades =  () => {

    getLocalidades().then(({ data: { data } }) => {
      const options = data.map((item) => ({
        label: item.municipio,
        value: item.id.toString(),
      }))
      setSelectLocalidad(options)
    })
    setLoaderEmp(false)
  }

  useEffect(() => {
    fetchLocalidades();

    methods.reset({
      nombre: ips?.nombre ?? "",
      direccion: ips?.direccion ?? "",
      ciudad: ips?.localidade_id ?? "",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ips])

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre IPS es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre IPS">
              <Input
                {...field}
                placeholder="Nombre IPS"
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
          name="direccion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Dirección IPS es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Dirección IPS">
              <Input
                {...field}
                placeholder="Dirección IPS"
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
          name="ciudad"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Ciudad IPS es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciudad IPS">
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
                  options={selectLocalidad}
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
