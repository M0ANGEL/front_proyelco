import styled from "styled-components";
import { Card } from "antd";

export const StyledCardGrid = styled(Card)`
  border-radius: 8px;
  border: 1px solid #d18f02;
  background-color: #f9af11;
  color: white;
  .ant-card-head {
    border-bottom: 1px dashed white;
  }
  .ant-card-body {
    margin-top: 15px;
    min-height: 60px;
  }
  .ant-card-head-title {
    width: 100%;
    overflow-wrap: break-word;
    white-space: unset !important;
    text-overflow: unset !important;
    span {
      font-size: 12pt;
      color: white;
    }
  }
`;
