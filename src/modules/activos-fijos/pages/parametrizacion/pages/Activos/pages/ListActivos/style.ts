import { Button, Tag } from "antd";
import styled from "styled-components";

export const StyledPanelFilterActivos = styled.div`
  background: rgb(240, 242, 245);
  width: 100%;
  margin-bottom: 10px;
  padding: 20px 10px;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 8px;
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

export const CustomTag = styled(Tag)`
  width: 100%;
  text-align: center;
`;
