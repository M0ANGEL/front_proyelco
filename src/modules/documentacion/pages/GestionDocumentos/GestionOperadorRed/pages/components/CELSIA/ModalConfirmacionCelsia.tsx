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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BASE_URL } from "@/config/api";

interface ModalConfirmacionProps {
  visible: boolean;
  actividad: any;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalConfirmacionCelsia = ({
  visible,
  actividad,
  onClose,
  onConfirm,
}: ModalConfirmacionProps) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para validar el tipo de archivo por extensión
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

    // Validar por tipo MIME también
    const tiposMimePermitidos = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/pdf'
    ];
    
    if (!tiposMimePermitidos.includes(file.type)) {
      notification.error({
        message: "Tipo de archivo no válido",
        description: "El archivo no es un JPG, PNG o PDF válido",
      });
      return false;
    }

    // Validar tamaño (10MB)
    const tamanoMaximo = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > tamanoMaximo) {
      notification.error({
        message: "Archivo muy grande",
        description: `El archivo debe ser menor a 1GB. Tamaño actual: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`,
      });
      return false;
    }

    return true;
  };

 const uploadProps: UploadProps = {
    multiple: true,
    accept: ".jpg,.jpeg,.png,.pdf",
    beforeUpload: (file) => {
      if (!validarArchivo(file)) {
        return false;
      }

      setFiles((prev) => [...prev, file]);
      return false; // evitar subida automática
    },

    onRemove: (file) => {
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },

    fileList: files,
  };



  const handleConfirmar = async () => {
    try {
      const values = await form.validateFields();

      // validación de archivos
      for (const file of files) {
        if (!validarArchivo(file as any)) return;
      }

      setLoading(true);

      const formData = new FormData();

      // Datos de la actividad
      formData.append("id", actividad.id.toString());
      formData.append("codigo_proyecto", actividad.codigo_proyecto);
      formData.append("codigo_documento", actividad.codigo_documento);
      formData.append("etapa", actividad.etapa.toString());
      formData.append("actividad_id", actividad.actividad_id.toString());
      formData.append(
        "actividad_depende_id",
        actividad.actividad_depende_id?.toString() || ""
      );
      formData.append("tipo", actividad.tipo);
      formData.append("orden", actividad.orden.toString());
      formData.append("fecha_proyeccion", actividad.fecha_proyeccion);
      formData.append("fecha_actual", actividad.fecha_actual);
      formData.append("operador", actividad.operador.toString());
      formData.append("actividad_nombre", actividad.actividad?.actividad || "");
      formData.append("observacion", values.observacion);

      // agregar múltiples archivos
      files.forEach((file) => {
        formData.append("archivos[]", file as any);
      });

      formData.append("estado", "2");
      formData.append(
        "fecha_confirmacion",
        new Date().toISOString().split("T")[0]
      );
      formData.append("usaurio_id", "1");

      const response = await fetch(BASE_URL + "gestion-documentos-confirmar", {
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
          message: "Actividad confirmada",
          description: `"${actividad.actividad?.actividad}" ha sido confirmada exitosamente`,
        });

        form.resetFields();
        setFiles([]);
        onConfirm();
        onClose();
      } else {
        throw new Error(result.message || "Error al confirmar la actividad");
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Error al validar formulario:", error);
      notification.error({
        message: "Error",
        description: error.message || "No se pudo confirmar la actividad",
      });
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
      title={`Confirmar Actividad: ${actividad?.actividad?.actividad}`}
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="confirm" type="primary" loading={loading} onClick={handleConfirmar}>
          Confirmar Actividad
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="observacion"
          label="Observación"
          rules={[
            { required: true, message: "Por favor ingrese una observación" },
            { min: 5, message: "La observación debe tener al menos 5 caracteres" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Ingrese observaciones sobre la actividad..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Subir Archivos (Opcional)"
          extra={
            <div>
              <p><strong>Formatos permitidos:</strong> JPG, JPEG, PNG, PDF</p>
              <p><strong>Tamaño máximo por archivo:</strong> 1GB</p>
              <p><strong>Puede seleccionar varios archivos.</strong></p>
            </div>
          }
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Seleccionar archivos</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};