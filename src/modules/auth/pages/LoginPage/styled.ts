import styled from "styled-components";
import { Card, Layout, Space, Typography, Button, Input } from "antd";

const { Title } = Typography;

const topSpace = 15;
const inputLoginProperties = `
font-size: 18px !important;
.ant-input-prefix {
    color: rgb(201 201 201);
}
:disabled{
  background-color: #FFFFFF !important;
}
`;

export const LoginCard = styled(Card)`
  background: #00000000;
  margin: 0px 100px;
  margin-top: ${topSpace}%;
  border-radius: 0px;
  border: none;
  transition: margin 0.5s;
  z-index: 2;

  .ant-card-head {
    background: none;
    border-bottom: 0px;
  }
  .ant-card-body {
    background: rgba(0, 0, 0, 0.89);
    border: 1px solid #b9b7b7;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    padding: 30px;
  }

  @media (max-width: 970px) {
    margin: ${topSpace}% 50px;
  }

  @media (max-width: 768px) {
    margin: ${topSpace}% 100px;
  }

  @media (max-width: 576px) {
    margin: ${topSpace * 2}% 20px;
  }
`;

export const LoginLayout = styled(Layout)`
  background-color: grey;
  border-radius: 0px;
  padding: 10px;
  background-image: url("./bg.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
`;

export const SpaceImage = styled(Space)`
  display: flex;
  justify-content: center;
  padding-top: ${topSpace + 10}%;
  position: relative;
  z-index:3;
`;

export const LoginTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 24px !important;
  text-align: center;
  color: #ffffff !important;
`;

export const LoginButton = styled(Button)`
  font-size: 20px !important;
  background-color: #ffb923;
  color: #ffffff;
  border: none;
  font-size: 22px !important;
  height: auto !important;
  padding: 5px !important;
  width: 100% !important;

  :hover,
  :active {
    background-color: #ffc241;
    color: #ffffff !important;
  }

  :disabled,
  :disabled :hover {
    background-color: rgb(215 173 86);
    color: #ffffff !important;
  }
`;
export const LoginInput = styled(Input)`
  ${inputLoginProperties}
`;

export const LoginInputPassword = styled(Input.Password)`
  ${inputLoginProperties}
`;
