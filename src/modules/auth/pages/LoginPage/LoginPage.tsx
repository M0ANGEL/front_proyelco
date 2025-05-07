import { Row, Col, Image, notification } from "antd";
import { LoginCard, LoginLayout, SpaceImage, LoginTitle } from "./styled";
import { useState } from "react";
import { FormEmpresa, FormLogin } from "../..";
import { Notification } from "./types";
import { UserData } from "@/services/types";

export const LoginPage = () => {
  const [loginStep, setLoginStep] = useState(0);
  const [spin, setSpin] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();
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
            <LoginCard
              // title={
              //   <Image src="./logo_login.png" preview={false} width={130} />
              // }
            >
              <LoginTitle level={2}>PROYELCO</LoginTitle>
              {loginStep == 0 ? (
                <FormLogin
                  onPushNotification={(data: Notification) =>
                    pushNotification(data)
                  }
                  onChangeLoginStep={(value: number, user: UserData) => {
                    setLoginStep(value);
                    setUserData(user);
                  }}
                  onFetch={(state: boolean) => setSpin(state)}
                  spin={spin}
                />
              ) : (
                <FormEmpresa
                  user={userData}
                  onPushNotification={(data: Notification) =>
                    pushNotification(data)
                  }
                  onChangeLoginStep={(value: number) => setLoginStep(value)}
                  onFetch={(state: boolean) => setSpin(state)}
                  spin={spin}
                />
              )}
            </LoginCard>
          </Col>
          {/* <Col md={12} xs={{ span: 0 }}>
            <SpaceImage>
              <Image src="./logo.png" preview={false} height={400} />
            </SpaceImage>
          </Col> */}
        </Row>
      </LoginLayout>
    </>
  );
};
