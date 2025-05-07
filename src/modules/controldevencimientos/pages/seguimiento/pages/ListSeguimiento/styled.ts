import {Table,Button, Form} from 'antd';
import styled from 'styled-components';

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color:#ffffff;
    color: #ffffff;
  }

  .ant-table-tbody > tr.even-row > td {
    background-color: #f0f0f0;
  }

  .ant-table-tbody > tr.odd-row > td {
    background-color: #ffffff;
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
    color: white !important;
    background-color: darkseagreen !important;
  }
`;
