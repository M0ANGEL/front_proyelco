import styled from "styled-components";

export const CustomUploadListStyles = styled.div`
  .custom-dragger {
    width: 100%;
    max-width: 300px; /* Ajustamos el ancho para que sea más compacto */
    height: 100px; /* Reducimos la altura */
    border: 3px dashed #1890ff;
    border-radius: px;
    background: #fafafa;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .ant-upload-drag-icon {
    font-size: 18px; /* Reducimos el tamaño del icono */
    color: #1890ff;
  }

  .ant-upload-text {
    font-size: 12px; /* Texto más pequeño */
    font-weight: 500;
    color: #333;
  }

  .ant-upload-list-item {
    background-color: #f9f9f9;
    border: 1px solid #d9d9d9;
    padding: 5px;
    border-radius: 4px;
    margin: 5px 0;
  }

  .ant-upload-list-item-name {
    color: #000 !important;
    font-size: 12px;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
`;
