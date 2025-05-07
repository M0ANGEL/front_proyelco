import { InputNumber, Upload } from "antd";
import styled from "styled-components";

export const CustomUpload = styled(Upload)`
  width: 100%;
  .ant-upload {
    width: 100%;
  }
  .ant-upload-list-item {
    margin-top: 5px;
  }
`;

export const CustomInputNumber = styled(InputNumber)`
  .ant-input-number-input-wrap {
    input {
      text-align: center;
    }
  }
`;
