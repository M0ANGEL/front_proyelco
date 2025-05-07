import { Form } from "antd";
import styled from "styled-components";

export const SearchBar = styled(Form.Item)`
  input {
    border: 1px solid rgb(249 175 17);
    ::placeholder {
      color: grey;
    }
  }
`;

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 5px;

  .ant-form-item-label {
    padding-bottom: 2px;
    label {
      font-size: 10pt;
    }
  }
`;