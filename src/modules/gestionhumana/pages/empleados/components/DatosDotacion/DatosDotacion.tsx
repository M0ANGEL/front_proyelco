import { useEffect, useState } from "react";

import { Col, Input, Row, Select, Spin, Typography, InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { LoadingOutlined } from "@ant-design/icons";
import { Props } from "../types";

const { Text } = Typography;
const { TextArea } = Input;

export const DatosDotacion = ({ empleado }: Props) => {
  const methods = useFormContext();
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true);

  useEffect(() => {

    if (empleado) {
      methods.setValue('tipo_sangre', empleado?.tipo_sangre)
      methods.setValue('talla_camisa', empleado?.talla_camisa)
      methods.setValue('talla_pantalon', empleado?.talla_pantalon)
      methods.setValue('talla_zapatos', empleado?.talla_zapatos)
      methods.setValue('observacion', empleado?.observacion)
    }
    setLoaderEmp(false)
  }, [empleado])

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="tipo_sangre"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Tipo de sangre">
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
                    { value: "A+", label: "A+" },
                    { value: "B+", label: "B+" },
                    { value: "O+", label: "O+" },
                    { value: "AB+", label: "AB+" },
                    { value: "A-", label: "A-" },
                    { value: "B-", label: "B-" },
                    { value: "AB-", label: "AB-" },
                    { value: "O-", label: "O-" },
                  ]}
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
          name="talla_camisa"
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Talla de camisa">
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
                    { value: "XS", label: "XS" },
                    { value: "S", label: "S" },
                    { value: "M", label: "M" },
                    { value: "L", label: "L" },
                    { value: "XL", label: "XL" },
                    { value: "XXL", label: "XXL" },
                  ]}
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
          name="talla_pantalon"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Talla pantalón">
              <Input
                {...field}
                maxLength={20}
                placeholder="Talla pantalón"
                status={error && "error"}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); 
                  field.onChange(value);
                }}
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
      {/* <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="estado"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Estado es requerido",
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
                      { value: "1", label: "ACTIVO"},
                      { value: "0", label: "RETIRADO" },
                    ]}
                    status={error && "error"}
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col> */}
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