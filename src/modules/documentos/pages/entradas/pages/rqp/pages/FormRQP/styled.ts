import { Button, Form, Typography, Upload } from "antd";
import styled from "styled-components";
const { Text } = Typography;

export const StyledText = styled(Text)`
  cursor: pointer;
  padding: 1px 25px;
  :hover {
    border: 1px solid rgb(211 211 211);
    border-radius: 3px;
  }
`;

export const SearchBar = styled(Form.Item)`
  margin-bottom: 0px;
  input {
    border: 1px solid rgb(249 175 17);
    ::placeholder {
      color: grey;
    }
  }
`;

export const CustomUpload = styled(Upload)`
  width: 100%;
  .ant-upload {
    width: 100%;
  }
  .ant-upload-list-item {
    margin-top: 5px;
  }
`;

export const GreenButton = styled(Button)`
  color: white;
  background-color: green;
  :hover {
    border: 1px solid white !important;
    color: white !important;
    background-color: mediumseagreen !important;
  }
`;
