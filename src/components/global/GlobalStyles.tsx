// components/global/GlobalStyles.tsx
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-family: "Inter", "Segoe UI", Roboto, sans-serif;
    font-size: 16px;
  }

  body {
    background-color: #f8f9fa;
    color: #424242;
    line-height: 1.5;
  }

  /* Estilos básicos que no interfieren con tu SCSS */
  .ant-btn-primary {
    background: linear-gradient(135deg, #1976d2, #1565c0);
    border: none;
    border-radius: 8px;
    font-weight: 500;
    
    &:hover {
      background: linear-gradient(135deg, #1565c0, #1976d2);
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    }
  }
`;