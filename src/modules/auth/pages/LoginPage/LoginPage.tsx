import { Row, Col,notification } from "antd";
import { LoginCard, LoginLayout, LoginTitle } from "./styled";
import { useState } from "react";
import { Notification } from "./types";
import { FormLogin } from "../../components";

export const LoginPage = () => {
  const [spin, setSpin] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();

  const pushNotification = ({
    type = "success",
    title,
    description,
    duration = 5,
  }: Notification) => {
    api[type]({
      message: title,
      description: description,
      placement: "topRight",
      duration: duration,
    });
  };
  
  return (
    <>
      {contextHolder}
      <LoginLayout>
        <Row gutter={[16, 16]}>
          <Col md={12} xs={24}>
            <LoginCard>
              <LoginTitle level={2}>PROYELCO</LoginTitle>
              <FormLogin
                onPushNotification={(data: Notification) =>
                  pushNotification(data)
                }
                onFetch={(state: boolean) => setSpin(state)}
                spin={spin}
              />
            </LoginCard>
          </Col>
        </Row>
      </LoginLayout>
    </>
  );
};
