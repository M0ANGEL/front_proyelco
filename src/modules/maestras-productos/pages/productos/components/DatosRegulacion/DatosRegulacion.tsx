/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Input, InputNumber, Row, Typography } from "antd";

const { Text } = Typography;

export const DatosRegulacion = () => {
  const methods = useFormContext();

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="circular_regulacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Circular Regulación es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Circular Regulación:">
                <Input
                  {...field}
                  maxLength={100}
                  placeholder="Circular Regulación"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Controller
                name="p_regulado_compra"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Precio Regulado Compra es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Precio Regulado Compra:">
                    <InputNumber
                      {...field}
                      stringMode
                      maxLength={15}
                      step={"0.01"}
                      precision={2}
                      controls={false}
                      keyboard={false}
                      placeholder="Precio Regulado Compra"
                      status={error && "error"}
                      style={{ width: "100%" }}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="p_regulado_venta"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Precio Regulado Venta es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Precio Regulado Venta:">
                    <InputNumber
                      {...field}
                      stringMode
                      maxLength={15}
                      step={"0.01"}
                      precision={2}
                      controls={false}
                      keyboard={false}
                      placeholder="Precio Regulado Venta"
                      status={error && "error"}
                      style={{ width: "100%" }}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="ium"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "IUM es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="IUM:">
                <Input
                  {...field}
                  maxLength={20}
                  placeholder="IUM"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="ium1"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="IUM1:">
                <Input
                  {...field}
                  maxLength={20}
                  placeholder="IUM1"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="ium2"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="IUM2:">
                <Input
                  {...field}
                  maxLength={20}
                  placeholder="IUM2"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="ium3"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="IUM3:">
                <Input
                  {...field}
                  maxLength={20}
                  placeholder="IUM3"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
