import { useEffect, useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { Props } from "../types";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const DatosBasicos = ({ pension }: Props) => {
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);
  const [selectPension, setSelectPension] = useState<SelectProps["options"]>([]);

  const methods = useFormContext();

  useEffect(() => {
    if (pension) {
      methods.setValue("nombre", pension?.nombre);
      methods.setValue("estado", pension?.estado);
    } else {
      methods.setValue("estado", "1");
    }
  }, [pension]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de fondo de pensión es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre fondo de pensión">
              <Input
                {...field}
                placeholder="Nombre fondo de pensión"
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
  );
};
