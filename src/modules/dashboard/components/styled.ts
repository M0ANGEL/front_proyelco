import { Card, Statistic } from 'antd';
import styled from 'styled-components';

export const StyledCardDashBoard = styled(Card)`
  background: transparent;
  border: none;
  
  .ant-card-body {
    padding: 24px 0;
  }
`;

export const StyledStadistic = styled(Statistic)`
  .ant-statistic-title {
    color: white !important;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
  }
  
  .ant-statistic-content {
    color: white !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    .ant-statistic-content-value {
      font-size: 32px;
      font-weight: bold;
    }
    
    .ant-statistic-content-prefix {
      font-size: 24px;
    }
  }
`;

export const StadisticTitle = styled.div`
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
`;