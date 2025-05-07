import { Typography, Statistic, Card } from "antd";
import styled from "styled-components";

const { Text } = Typography;

export const StyledCardDashBoard = styled(Card)`
  border-radius: 0px;
  background: none;
  box-shadow: none;
  border: none;
  .ant-card-head {
    border-bottom: none;
  }

  .ant-card-body {
    padding: 24px 12px;
  }
`;

export const StyledStadistic = styled(Statistic)`
  .ant-statistic-title {
    min-height: 55px;
    display: flex;
    align-items: center;
  }
  .ant-statistic-content {
    align-items: unset;
    display: flex;
    .ant-statistic-content-value,
    .ant-statistic-content-prefix {
      color: white;
      font-size: 30pt;
    }

    .ant-statistic-content-prefix {
      margin-right: 15px;
      font-size: 35pt;
    }
  }
`;

export const StadisticTitle = styled(Text)`
  color: white;
  font-weight: 500;
  font-size: 12pt;
`;
