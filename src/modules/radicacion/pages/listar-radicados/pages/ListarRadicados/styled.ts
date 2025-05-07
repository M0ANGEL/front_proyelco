import { Button, Form } from "antd";
import styled from "styled-components";

export const SearchBar = styled(Form.Item)`
  margin-bottom: 0px;
  input {
    border: 1px solid rgb(249 175 17);
    ::placeholder {
      color: grey;
    }
  }
`;

export const ButtonUpload = styled(Button)`
  background-color: #00b500;
  color: white;
  border: 1px solid white;
  :hover {
    color: white !important;
    background-color: #03d403 !important;
    border: 1px solid white !important;
  }
`;
