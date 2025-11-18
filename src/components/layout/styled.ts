import { Button, Card, Form } from 'antd';
import styled from 'styled-components';

// Logo minimalista (blanco sobre azul)
export const LogoSider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  img {
    height: 40px;
    width: auto;
    object-fit: contain;
    filter: brightness(0) invert(1);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
    }
  }
`;

// Logo con fondo blanco y texto
export const LogoContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  img {
    height: 35px;
    width: auto;
    object-fit: contain;
  }
  
  .logo-text {
    font-size: 18px;
    font-weight: bold;
    color: #4096ff;
    margin: 0;
  }
`;

// Logo solo con texto (si no tienes imagen)
export const TextLogo = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .logo-text {
    font-size: 20px;
    font-weight: bold;
    color: #4096ff;
    margin: 0;
    letter-spacing: 0.5px;
  }
`;

// Logo circular (para logos que se vean bien en forma circular)
export const CircularLogo = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  img {
    height: 32px;
    width: 32px;
    object-fit: contain;
    border-radius: 50%;
  }
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

export const StyledCard = styled(Card)`
  border-radius: 0px;
  background: #ffffff;
  // box-shadow: 5px 5px 11px #d4d4d4, -5px -5px 11px #ffffff;
  // margin: 10px;
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