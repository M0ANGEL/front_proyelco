import { Typography } from "antd";
import styled from "styled-components";
const { Text } = Typography;

export const StyledText = styled(Text)<{ accion: string }>`
  cursor: ${(props) =>
    ["edit", "create"].includes(props.accion) ? "pointer" : "auto"};
  padding: 1px 25px;
  :hover {
    border: 1px solid rgb(211 211 211);
    border-radius: 3px;
  }
`;
