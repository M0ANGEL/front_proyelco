import styled from "styled-components";
import { Card } from "antd";

// Wrapper para el rectángulo gris
export const StyledWrapper = styled.div`
  background-color: rgba(211, 211, 211, 0.5); /* Gris opaco */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

// Personalización de la tarjeta
export const StyledCard = styled(Card)`
  .ant-card-body {
    background-color: white;
    border-radius: 5px;
    padding: 16px;
  }
`;
