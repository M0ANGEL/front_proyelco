import { Button, Form } from "antd";
import styled from "styled-components";
import { lighten } from "polished";

export const SearchBar = styled(Form.Item)`
  margin-bottom: 0px;
  input {
    border: 1px solid rgb(249 175 17);
    ::placeholder {
      color: grey;
    }
  }
`;

// Estilo para el contenedor del globo
export const BalloonContainer = styled.div`
  background-color: ${({ color }) =>
    color && lighten(0.2, color)}; /* Tono más claro */
  width: 380px;
  border-radius: 5px;
  margin-bottom: 15px; /* Puedes ajustar según sea necesario */
  padding: 10px;
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