import styled from "styled-components";
import { Space, Upload } from "antd";

export const CustomUpload = styled(Upload)`
  width: 100%;
  .ant-upload {
    width: 100%;
  }
  .ant-upload-list-item {
    margin-top: 5px;
  }
`;

export const CustomSpaceMotivos = styled(Space)`
  background-color: #f5f5f5;
  width: 100%;
  border: 1px solid #d9d9d9;
  padding: 4px 11px;
  border-radius: 6px;
`;
