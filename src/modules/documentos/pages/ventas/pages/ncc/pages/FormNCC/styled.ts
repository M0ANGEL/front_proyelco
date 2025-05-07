import { Typography } from "antd";
import styled from "styled-components";
const { Text, Paragraph } = Typography;

export const StyledText = styled(Text)<{ accion: string }>`
  cursor: ${(props) =>
    ["edit", "create"].includes(props.accion) ? "pointer" : "auto"};
  padding: 1px 25px;
  :hover {
    border: 1px solid rgb(211 211 211);
    border-radius: 3px;
  }
`;

export const StyledParagraph = styled(Paragraph)<{ accion: string }>`
  cursor: ${(props) =>
    ["edit", "create"].includes(props.accion) ? "pointer" : "auto"};
  padding: 1px;
`;
