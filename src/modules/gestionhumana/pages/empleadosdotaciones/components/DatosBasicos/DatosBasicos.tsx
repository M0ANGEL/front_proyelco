import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { EmpleadoDotacion } from "@/services/types";
import { Col, Input, InputNumber, Row, Select, Spin, Typography } from "antd";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface Props {
  empleado?: EmpleadoDotacion
}

const { Text } = Typography

export const DatosBasicos = ({ empleado }: Props) => {
  const methods = useFormContext()

  useEffect(() => {
    methods.reset(
      empleado
       ? {
            nombre: empleado.nombre_completo,
            cedula: empleado.cedula,
            talla_camisa: empleado.talla_camisa,
            talla_pantalon: empleado.talla_pantalon,
            talla_zapatos: empleado.talla_zapatos,
          }
        : {
            empleado: null,
            cedula: null,
            talla_camisa: null,
            talla_pantalon: null,
            talla_zapatos: null,
          }
    )
  }, [empleado])
  
  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Empleado es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Empleado">
              <Input
                {...field}
                maxLength={20}
                placeholder="Empleado"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
                disabled={!!empleado}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="cedula"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cédula es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cédula">
              <Input
                {...field}
                maxLength={20}
                placeholder="Cédula"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
                disabled={!!empleado}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="talla_camisa"
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Talla de camisa">
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
                    { value: "XS", label: "XS" },
                    { value: "S", label: "S" },
                    { value: "M", label: "M" },
                    { value: "L", label: "L" },
                    { value: "XL", label: "XL" },
                    { value: "XXL", label: "XXL" },
                  ]}
                  status={error && "error"}
                />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="talla_pantalon"
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Talla pantalón">
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    parseInt(optionA?.label ?? 0) - parseInt(optionB?.label ?? 0)
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={[
                    { value: "4", label: "4" },
                    { value: "6", label: "6" },
                    { value: "8", label: "8" },
                    { value: "10", label: "10" },
                    { value: "12", label: "12" },
                    { value: "14", label: "14" },
                    { value: "28", label: "28" },
                    { value: "30", label: "30" },
                    { value: "32", label: "32" },
                    { value: "34", label: "34" },
                    { value: "36", label: "36" },
                    { value: "38", label: "38" },
                    { value: "40", label: "40" },
                    { value: "42", label: "42" },
                  ]}
                  status={error && "error"}
                />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="talla_zapatos"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Talla zapatos">
              <InputNumber
                {...field}
                placeholder="Talla zapatos"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
                type="number"
                max={60}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  )
}