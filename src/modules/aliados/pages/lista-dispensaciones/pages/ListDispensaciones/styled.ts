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

export const GreenButton = styled(Button)`
  color: white;
  background-color: green;
  :hover {
    border: 1px solid white !important;
    color: white !important;
    background-color: mediumseagreen !important;
  }
  :disabled {
    border: 1px solid white !important;
    color: #3e875f !important;
    background-color: mediumseagreen !important;
  }
`;
