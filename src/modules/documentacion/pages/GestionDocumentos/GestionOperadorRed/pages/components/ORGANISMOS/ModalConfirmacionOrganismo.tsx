import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  UploadFile,
  UploadProps,
  notification,
  Card,
  Space,
  Typography,
} from "antd";
import { 
  UploadOutlined, 
  CheckCircleOutlined,
  CloseOutlined,
  PaperClipOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { BASE_URL } from "@/config/api";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ModalConfirmacionProps {
  visible: boolean;
  actividad: any;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalConfirmacionOrganismo = ({
  visible,
  actividad,
  onClose,
  onConfirm,
}: ModalConfirmacionProps) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para validar cada archivo
  const validarArchivo = (file: File): boolean => {
    const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.pdf'];
    const extension = '.' + file.name.toLowerCase().split('.').pop();

    if (!extensionesPermitidas.includes(extension)) {
      notification.error({
        message: "Tipo de archivo no válido",
        description: `Solo se permiten: ${extensionesPermitidas.join(', ')}`,
      });
      return false;
    }

    const tamanoMaximo = 10 * 1024 * 1024; // 10MB
    if (file.size > tamanoMaximo) {
      notification.error({
        message: "Archivo muy grande",
        description: `El archivo debe ser menor a 10MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      });
      return false;
    }

    return true;
  };

  const uploadProps: UploadProps = {
    multiple: true,
    accept: ".jpg,.jpeg,.png,.pdf",
    beforeUpload: (file) => {
      if (!validarArchivo(file)) return Upload.LIST_IGNORE;
      setFiles((prev) => [...prev, file as UploadFile]);
      return false; // prevenir upload automático
    },
    onRemove: (file) => {
      setFiles((prev) => prev.filter(f => f.uid !== file.uid));
    },
    fileList: files,
  };

  const handleConfirmar = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      const formData = new FormData();
      formData.append("id", actividad.id.toString());
      formData.append("observacion", values.observacion);

      if (files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`archivos[${index}]`, file as any);
        });
      }

      const response = await fetch(`${BASE_URL}gestion-documentos-confirmar-organismos`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        notification.success({
          message: "✅ Actividad confirmada",
          description: `"${actividad.actividad?.actividad}" ha sido confirmada exitosamente`,
        });
        form.resetFields();
        setFiles([]);
        onConfirm();
        onClose();
      } else {
        throw new Error(result.message || "Error al confirmar la actividad");
      }

    } catch (error: any) {
      console.error("Error en la confirmación:", error);
      notification.error({
        message: "❌ Error",
        description: error.message || "No se pudo confirmar la actividad",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFiles([]);
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
          <span>Confirmar Actividad</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button 
          key="cancel" 
          onClick={handleCancel}
          icon={<CloseOutlined />}
          disabled={loading}
        >
          Cancelar
        </Button>,
        <Button
          key="confirm"
          type="primary"
          loading={loading}
          onClick={handleConfirmar}
          icon={<CheckCircleOutlined />}
          style={{
            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
            border: 'none',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Confirmando...' : 'Confirmar'}
        </Button>,
      ]}
      width={500}
      destroyOnClose
    >
      {/* Información de la actividad */}
      <Card 
        size="small" 
        style={{ marginBottom: 20, borderLeft: '4px solid #1890ff' }}
        bodyStyle={{ padding: '12px' }}
      >
        <Text strong style={{ fontSize: '14px' }}>
          {actividad?.actividad?.actividad || "Actividad"}
        </Text>
      </Card>

      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          name="observacion"
          label="Observación"
        >
          <TextArea
            rows={3}
            placeholder="Ingrese observaciones sobre la actividad..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item label="Archivos de soporte (Opcional)">
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Seleccionar archivos</Button>
            </Upload>

            {files.map((file) => (
              <Card
                key={file.uid}
                size="small"
                style={{ backgroundColor: '#fafafa', marginBottom: 4 }}
                bodyStyle={{ padding: '8px 12px' }}
              >
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Space>
                    <PaperClipOutlined />
                    <Text>{file.name}</Text>
                  </Space>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setFiles(prev => prev.filter(f => f.uid !== file.uid))}
                    size="small"
                  />
                </Space>
              </Card>
            ))}

            <Text type="secondary" style={{ fontSize: '12px' }}>
              Formatos: JPG, PNG, PDF • Máx. 10MB por archivo
            </Text>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
