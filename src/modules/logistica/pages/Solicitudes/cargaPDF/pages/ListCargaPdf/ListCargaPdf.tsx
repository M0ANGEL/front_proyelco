import { useState } from "react";
import { Upload, Button, List, Typography, notification, message, Card } from "antd";
import { FilePdfOutlined, SendOutlined, InboxOutlined } from "@ant-design/icons";
import { BASE_URL } from "@/config/api";

const { Text } = Typography;
const { Dragger } = Upload;

export const ListCargaPdf = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const props = {
    multiple: true,
    accept: ".pdf",
    beforeUpload: (file: any) => {
      if (file.type !== "application/pdf") {
        message.error(`${file.name} no es un archivo PDF válido`);
        return Upload.LIST_IGNORE;
      }
      return false; // evita subida automática
    },
    onChange(info: any) {
      setFileList(info.fileList);
    },
    onDrop(e: any) {
      console.log("Archivo arrastrado", e.dataTransfer.files);
    },
  };

  const enviarPdfs = async () => {
    if (fileList.length === 0) {
      notification.warning({ message: "Debes seleccionar al menos un PDF" });
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => formData.append("pdfs[]", file.originFileObj));

    try {
      setLoading(true);
      const response = await fetch(BASE_URL + "pdf-logistica", {
        method: "POST",
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Error en la carga de PDFs");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "consolidado.pdf";
      a.click();

      notification.success({ message: "PDFs procesados con éxito" });
      setFileList([]);
    } catch (error: any) {
      notification.error({ message: "Error al procesar los PDFs", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Carga de PDFs" style={{ maxWidth: "100%", margin: "20px auto", textAlign: "center" }}>
      <Dragger {...props} fileList={fileList} style={{ padding: 20 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 48, color: "#1890ff" }} />
        </p>
        <p className="ant-upload-text">Arrastra tus archivos PDF aquí o haz clic para seleccionar</p>
        <p className="ant-upload-hint">Solo se permiten archivos PDF.</p>
      </Dragger>

      {fileList.length > 0 && (
        <List
          style={{ marginTop: 20 }}
          header={<Text strong>Archivos seleccionados</Text>}
          bordered
          dataSource={fileList}
          renderItem={(item) => (
            <List.Item>
              <FilePdfOutlined style={{ color: "red", marginRight: 8 }} />
              {item.name}
            </List.Item>
          )}
        />
      )}

      <Button
        type="primary"
        icon={<SendOutlined />}
        style={{ marginTop: 20, width: "10%" }}
        loading={loading}
        onClick={enviarPdfs}
      >
        Enviar PDFs
      </Button>
    </Card>
  );
};
