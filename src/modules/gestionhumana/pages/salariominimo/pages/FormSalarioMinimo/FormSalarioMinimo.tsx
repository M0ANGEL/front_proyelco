import { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Spin,
  Typography,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { actualizarSalariosMinimos } from "@/services/gestion-humana/salarioMinimoAPI";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
export const FormSalarioMinimo = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState(false);
  const control = useForm();
  const navigate = useNavigate();
  
  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);

    actualizarSalariosMinimos(data)
      .then(({ data }) => {
        notificationApi.open({
          type: "success",
          message: data.message + ' Total ' + data.updated_count ,
        });
        setTimeout(() => {
          navigate("../../../gestionhumana/empleados");
        }, 2000);
      })
      .catch(({ response: { data } }) => {
        notificationApi.open({
          type: "error",
          message: data.message,
        });
      })
      .finally(() => setLoader(false));
  };

  return (
    <>
      {contextHolder}
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard
          title={
            <Title level={4}>
              ACTUALIZACIÓN MASIVA DE EMPLEADOS CON SALARIO MINIMO
            </Title>
          }
        >
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} style={{ width: "100%" }}>
                <Controller
                  name="salario_minimo"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Salario minimo es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem
                      required
                      label="Ingrese nuevo salario minimo"
                    >
                      <Input
                        {...field}
                        placeholder="$ Ingrese nuevo salario minimo"
                        maxLength={80}
                        status={error && "error"}
                        style={{ textTransform: "uppercase" }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(value);
                        }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={24} sm={12}>
                <StyledFormItem label=" ">
                  <Button type="primary" block htmlType="submit">
                    Actualizar salario minimo
                  </Button>
                </StyledFormItem>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
