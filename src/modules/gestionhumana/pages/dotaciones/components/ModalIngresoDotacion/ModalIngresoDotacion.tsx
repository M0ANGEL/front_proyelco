import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Typography,
} from "antd";
import { Props } from "./types";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { dotacionIngresos } from "@/services/gestion-humana/dotacionesAPI";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { useNavigate } from "react-router-dom";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Paragraph, Text } = Typography;

export const ModalIngresoDotacion = ({
  open,
  setOpen,
  id,
  dotacion,
  talla,
}: Props) => {
  const control = useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(true);
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  

  const pushNotification = ({
      type = "success",
      title,
      description,
    }: Notification) => {
      api[type]({
        message: title,
        description: description,
        placement: "bottomRight",
      });
    };

  const onFinish = (data: any) => {
    setLoader(true);

    dotacionIngresos(data, id)
      .then((res) => {
        pushNotification({ title: res.data.message });
        setTimeout(() => {
          navigate("..");
        }, 800);
        setOpen(false)
      })
      .catch((error) => {
        pushNotification({
          type: "error",
          title: error.error,
          description: error.message,
        });
        setLoader(false);
      });

    return;
  };

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const formIngresoDotacion = () => {
    return (
      <>
        <Paragraph>
          <h3>
            {dotacion}-{talla}
          </h3>
        </Paragraph>
        <Form
          layout="vertical"
          onFinish={control.handleSubmit(onFinish)}
          onKeyDown={(e: any) => checkKeyDown(e)}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} style={{ width: "100%" }}>
              <Controller
                name="cantidad"
                control={control.control}
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
            <Col xs={24} sm={12} style={{ width: "100%" }}>
              <StyledFormItem label=" ">
                <Button type="primary" block htmlType="submit" disabled={!['gh_bienestar', 'gh_admin'].includes(user_rol)}>
                  Crear Ingreso
                </Button>
              </StyledFormItem>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        title={"Modal Ingreso Dotación"}
        key={`modal-ingreso-dotación`}
        footer={[]}
        style={{ top: 10 }}
      >
        {formIngresoDotacion()}
      </Modal>
    </>
  );
};
