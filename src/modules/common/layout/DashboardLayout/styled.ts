import { AppstoreOutlined } from "@ant-design/icons";
import { Space, Breadcrumb, Card, Form } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledLogo = styled.div`
  margin: 20px;
  width: 160px;
  height: 40px;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.3);

  &.logo-container {
    &--collapsed {
      width: 40px;
      height: 40px;
    }
  }

  & img {
    &.sidebar-logo {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      transition: opacity 0.3s ease-in-out;

      &--hide {
        opacity: 0;
      }
    }
  }
`;

export const StyledMenuCollapsedButton = styled(AppstoreOutlined)`
  padding: 0 10px;
  font-size: 30px;
  line-height: 64px;
  cursor: pointer;
  color: black;
`;

export const StyledContentSpace = styled(Space)`
  display: flex;
  place-items: start;
  margin: 0 auto;
  .ant-space-item {
    width: 100%;
  }
`;

export const CustomBreadcrumb = styled(Breadcrumb)`
  color: #71717a;
  li:last-child {
    color: #f9af11;
    font-weight: 500;
  }
`;

export const BreadcrumbLink = styled(Link)`
  :hover {
    background-color: #ffffff !important;
  }
`;

export const StyledCard = styled(Card)`
  border-radius: 0px;
  background: #ffffff;
  // box-shadow: 5px 5px 11px #d4d4d4, -5px -5px 11px #ffffff;
  // margin: 10px;
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

// Ajustes de estilo para la tarjeta que contiene los gráficos
export const StyledCardChart = styled(Card)`
  border-radius: 8px; // Ajustar los bordes redondeados si lo deseas
  background: #ffffff;
  padding: 20px; // Añadir espacio interior para separar mejor los elementos
  margin-bottom: 20px; // Espacio entre otros elementos en la página
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); // Sombra ligera para darle profundidad
`;

// Contenedor para los gráficos, organizando por filas con flexbox
export const ChartGrid = styled.div`
  display: flex;
  flex-wrap: wrap; // Permitir que los gráficos se reacomoden en filas
  justify-content: center; // Centrar los gráficos
  gap: 20px; // Espacio entre los gráficos
`;

export const ChartContainer = styled.div`
  width: 100%; // Ocupa todo el espacio disponible en móviles
  max-width: 400px; // Limitar el ancho máximo del gráfico
  flex: 1 1 300px; // Hace que los gráficos se reacomoden dinámicamente, ocupando al menos 300px
  margin: 0 auto; // Centra el gráfico en su contenedor
`;
