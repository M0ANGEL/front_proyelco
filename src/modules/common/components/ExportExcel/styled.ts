import { Button } from "antd";
import styled from "styled-components";

export const GreenButton = styled(Button)`
  color: white;
  background-color: green;
  :hover {
    border: 1px solid white !important;
    color: white !important;
    background-color: mediumseagreen !important;
  }
`;

export const BlueButton = styled(Button)`
  color: white !important;
  background-color: blue !important;
  border: none !important; /* Elimina el borde predeterminado del botón */

  :hover,
  :focus {
    background-color: blue !important; /* Forzar el color azul */
    border: 1px solid white !important; /* Define el borde */
    color: white !important; /* Asegura que el texto siga siendo blanco */
    outline: none !important; /* Evita el borde amarillo de enfoque */
  }
`;

export const RedButton = styled(Button)`
  color: white !important;
  background-color: #FF0000 !important; /* Color de fondo rojo */
  border: none !important; /* Elimina el borde predeterminado del botón */

  :hover, 
  :focus {
    background-color: #CC0000 !important; /* Color rojo más oscuro para hover */
    border: 1px solid white !important; /* Define el borde */
    color: white !important; /* Asegura que el texto siga siendo blanco */
    outline: none !important; /* Evita el borde amarillo de enfoque */
  }
`;


export const PurpleButton = styled(Button)`
  color: white !important;
  background-color: #6A0DAD !important; /* Color de fondo morado */
  border: none !important; /* Elimina el borde predeterminado del botón */

  :hover, 
  :focus {
    background-color: #5A0A8A !important; /* Morado más oscuro para hover */
    border: 1px solid white !important; /* Define el borde */
    color: white !important; /* Asegura que el texto siga siendo blanco */
    outline: none !important; /* Evita el borde amarillo de enfoque */
  }
`;

