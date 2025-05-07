import { useEffect, useState } from "react"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"
import { Col, DatePicker, Input, Row, Select, SelectProps, Spin, Switch, Typography } from "antd"
import { Controller, useFormContext } from "react-hook-form"
import { Props } from "../types"
import { getEmpleadosOn } from "@/services/maestras/empleadosAPI"
import { LoadingOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

const { TextArea } = Input
const { Text } = Typography
const dateFormat = "DD/MM/YYYY"

export const DatosBasicos = ({ contratoTerminado }: Props) => {

  const methods = useFormContext()
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>([])
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false)
  const [selectMotivosRetiro, setSelectMotivosRetiro] = useState<SelectProps["options"]>([]);
  const [selectDeshabilitar, setSelectDeshabilitar] = useState<SelectProps["options"]>([]);

  const fetchEmpleados = () => {

    getEmpleadosOn().then(({ data: { data } }) => {
      const options = data.map((item) => {
        return { value: item.id, label: item.cedula + '-' + item.nombre_completo };
      });
      setSelectEmpleado(options)
      setLoaderEmp(false);
    })
      .catch((error) => {
        console.log("error", error)
      });
  }

  useEffect(() => {

    setSelectMotivosRetiro([
      { label: 'VOLUNTARIO', value: '1' },
      { label: 'TERMINACIÓN', value: '2' },
      { label: 'PERIODO DE PRUEBA', value: '3' }
    ])

    setSelectDeshabilitar([
      { label: 'SI', value: 1 },
      { label: 'NO', value: 0 },
    ])

    setLoaderEmp(false)
    fetchEmpleados()
  }, [])

  useEffect(() => {
    if (contratoTerminado ) {
      methods.setValue('empleado', contratoTerminado?.empleado_id)
      methods.setValue('motivo', contratoTerminado?.motivo_retiro_id)
      methods.setValue('observacion', contratoTerminado?.observacion)
      methods.setValue('fecha_fin', contratoTerminado?.fecha_fin ? dayjs(contratoTerminado?.fecha_fin) : null)
    }
  }, [contratoTerminado]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="empleado"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Empleado es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Empleado">
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
                  options={selectEmpleado}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="motivo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Motivo retiro es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Motivo de retiro">
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
                  options={selectMotivosRetiro}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_fin"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Fecha terminación es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha terminación">
              <DatePicker
                {...field}
                status={error && "error"}
                style={{ width: "100%" }}
                // defaultValue={dayjs("01-01-2000", dateFormat)}
                format={dateFormat}
                placeholder="Fecha terminación"
              // disabledDate={disabledDate}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="deshabilitar"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "¿Deshabilitar de Sebthi? requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="¿Deshabilitar de Sebthi?">
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
                  options={selectDeshabilitar}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="observacion"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Observación">
              <TextArea
                {...field}
                placeholder="Observación"
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