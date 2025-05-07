import { Calendar } from "antd";
import styled from "styled-components";

export const CustomCalendar = styled(Calendar)`
  td.ant-picker-cell.ant-picker-cell-in-view {
    border: 2px solid #f9af11;
  }
    
  td.ant-picker-cell.ant-picker-cell-in-view:hover {
    background-color: #dddddd;
    color: #000000 !important;
  }

  td.ant-picker-cell.ant-picker-cell-disabled.ant-picker-cell-in-view {
    border: 2px solid;
  }
`;
