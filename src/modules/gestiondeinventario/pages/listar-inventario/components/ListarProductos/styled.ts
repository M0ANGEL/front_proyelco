import { Button } from "antd";
import styled from "styled-components";

export const ColumnSearch = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
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
