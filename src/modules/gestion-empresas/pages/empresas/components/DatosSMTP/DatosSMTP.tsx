/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Input, Row, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";


const { Text } = Typography;

export const DatosSMTP = () => {
  const methods = useFormContext();

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="servidor_smtp"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Servidor SMTP es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Servidor:">
                <Input
                  {...field}
                  placeholder="Servidor SMTP"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="protocolo_smtp"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Protocolo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Protocolo:">
                <Input
                  {...field}
                  placeholder="Protocolo SMTP"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="cuenta_de_correo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Correo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Correo:">
                <Input
                  {...field}
                  placeholder="Cuenta de correo SMTP"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="contrasena_correo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Contraseña es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Contraseña:">
                <Input.Password
                  {...field}
                  prefix={<LockOutlined style={{ color: "grey" }} />}
                  placeholder="Contraseña SMTP"
                  status={error && "error"}
                  autoComplete="off"
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
