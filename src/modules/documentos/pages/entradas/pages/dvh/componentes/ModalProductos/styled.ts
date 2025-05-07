import { Form, Typography } from "antd";
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
  input {
    border: 1px solid rgb(249 175 17);
    ::placeholder {
      color: grey;
    }
  }
`;
