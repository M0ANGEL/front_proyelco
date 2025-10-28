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

export const ModalConfirmacion = ({
  visible,
  actividad,
  onClose,
  onConfirm,
}: ModalConfirmacionProps) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<UploadFile>();
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
        description: `El archivo debe ser menor a 10MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      });
      return false;
    }

    return true;
  };

  const uploadProps: UploadProps = {
    maxCount: 1,
    accept: ".jpg,.jpeg,.png,.pdf",
    beforeUpload: (file) => {
      if (!validarArchivo(file)) {
        return false;
      }
      
      setFile(file);
      return false; // Evitar subida automática
    },
    onRemove: () => setFile(undefined),
    fileList: file ? [file] : [], // Mostrar el archivo seleccionado
  };

  const handleConfirmar = async () => {
    try {
      const values = await form.validateFields();
      
      // Validar archivo si existe (no es obligatorio)
      if (file && !validarArchivo(file as any)) {
        return;
      }

      setLoading(true);
      
      // Crear FormData para enviar archivo y datos
      const formData = new FormData();
      
      // Datos internos
      formData.append("id", actividad.id.toString());
      formData.append("codigo_proyecto", actividad.codigo_proyecto);
      formData.append("codigo_documento", actividad.codigo_documento);
      formData.append("etapa", actividad.etapa.toString());
      formData.append("actividad_id", actividad.actividad_id.toString());
      formData.append("actividad_depende_id", actividad.actividad_depende_id?.toString() || "");
      formData.append("tipo", actividad.tipo);
      formData.append("orden", actividad.orden.toString());
      formData.append("fecha_proyeccion", actividad.fecha_proyeccion);
      formData.append("fecha_actual", actividad.fecha_actual);
      formData.append("operador", actividad.operador.toString());
      formData.append("actividad_nombre", actividad.actividad?.actividad || "");
      formData.append("observacion", values.observacion);
      
      // Agregar archivo solo si existe
      if (file) {
        formData.append("archivo", file as any);
      }
      
      formData.append("estado", "2");
      formData.append("fecha_confirmacion", new Date().toISOString().split('T')[0]);
      formData.append("usaurio_id", "1");

      try {
        const response = await fetch(BASE_URL + "gestion-documentos-confirmar", {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          setFile(undefined);
          onConfirm();
          onClose();
        } else {
          throw new Error(result.message || "Error al confirmar la actividad");
        }
        
      } catch (error: any) {
        console.error("Error en la petición:", error);
        notification.error({
          message: "Error",
          description: error.message || "No se pudo confirmar la actividad",
        });
      }

      setLoading(false);

    } catch (error) {
      console.error("Error al validar formulario:", error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFile(undefined);
    onClose();
  };

  return (
    <Modal
      title={`Confirmar Actividad: ${actividad?.actividad?.actividad}`}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button
          key="confirm"
          type="primary"
          loading={loading}
          onClick={handleConfirmar}
        >
          Confirmar Actividad
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="observacion"
          label="Observación"
          rules={[
            { required: true, message: "Por favor ingrese una observación" },
            { min: 5, message: "La observación debe tener al menos 5 caracteres" }
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
          label="Subir Archivo (Opcional)"
          extra={
            <div>
              <p><strong>Formatos permitidos:</strong> JPG, JPEG, PNG, PDF</p>
              <p><strong>Tamaño máximo:</strong> 10MB</p>
              <p><strong>Opcional:</strong> Puede confirmar la actividad sin subir archivo</p>
            </div>
          }
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>
              Seleccionar archivo
            </Button>
          </Upload>
          {file && (
            <div style={{ marginTop: 8, padding: 8, backgroundColor: '#e6f7ff', borderRadius: 4 }}>
              <p><strong>Archivo seleccionado:</strong> {file.name}</p>
              <p><strong>Tamaño:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Tipo:</strong> {(file as any).type}</p>
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};