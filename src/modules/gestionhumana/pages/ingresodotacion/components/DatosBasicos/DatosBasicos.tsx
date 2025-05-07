import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface DatosBasicosProps {
  selectDotacion: SelectProps["options"];
}

export const DatosBasicos = ({ selectDotacion }: DatosBasicosProps) => {
  const methods = useFormContext();
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    if (selectDotacion) {
      setLoader(false);
    }
  }, [selectDotacion]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="dotacion_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Dotación es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Dotación">
              <Spin spinning={loader} indicator={<LoadingOutlined spin />}>
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
                  options={selectDotacion}
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
          name="cantidad"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cantidad es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cantidad">
              <Input
                {...field}
                maxLength={20}
                placeholder="Cantidad"
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
    </Row>
  );
};
