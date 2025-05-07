import { Controller, useFormContext } from "react-hook-form"
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled"
import { Col, DatePicker, Input, Row, Select, SelectProps, Spin, Typography } from "antd"
import { getEmpleados } from "@/services/maestras/empleadosAPI"
import { useEffect, useState } from "react"
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons"
import { Props } from "../types"
import dayjs from "dayjs"

const { Text } = Typography
const dateFormat = "DD/MM/YYYY"
const { TextArea } = Input

export const DatosBasicos = ({ ausentismo }: Props) => {

  const methods = useFormContext()
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>([])
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true)

  useEffect(() => {

    if (ausentismo) {
      methods.setValue('fecha_inicio', dayjs(ausentismo.fecha_inicio))
      methods.setValue('fecha_fin', dayjs(ausentismo.fecha_fin))
      methods.setValue('empleado', ausentismo?.empleado_id)
      methods.setValue('observacion', ausentismo?.observacion)
    } 

    setLoaderEmp(false)
    fetchEmpleados()
  }, [ausentismo]);

  const fetchEmpleados = () => {
    getEmpleados().then(({ data: { data } }) => {
      const options = data.map((item) => {
        return { 
                label: `${item.cedula} - ${item.nombre_completo} - ${item.estado === '1' ? 'Activo' : 'Inactivo'}`, 
                value: item.id.toString() 
        };
      });
      setSelectEmpleado(options)
      setLoaderEmp(false);
    })
      .catch((error) => {
        console.log("error", error)
      })
  }

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="fecha_inicio"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha inicio es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha inicio">
                <DatePicker
                  {...field}
                  status={error && "error"}
                  style={{ width: "100%" }}
                  // defaultValue={dayjs("01-01-2000", dateFormat)}
                  format={dateFormat}
                  placeholder="Fecha Inicio"
                // disabledDate={disabledDate}
                />
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
                message: "Fecha fin es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha fin">
                <DatePicker
                  {...field}
                  status={error && "error"}
                  style={{ width: "100%" }}
                  // defaultValue={dayjs("01-01-2000", dateFormat)}
                  format={dateFormat}
                  placeholder="Fecha Fin"
                // disabledDate={disabledDate}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
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
    </>
  )
}