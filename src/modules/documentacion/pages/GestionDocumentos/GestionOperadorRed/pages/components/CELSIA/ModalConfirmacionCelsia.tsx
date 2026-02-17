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
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BASE_URL } from "@/config/api";
import dayjs from "dayjs";

interface ModalConfirmacionCelsiaProps {
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
}: ModalConfirmacionCelsiaProps) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  // Determinar si la actividad ya está completada (estado 2)
  const esCompletada = actividad?.estado == "2";

  // Limpiar formulario cuando se abre/cierra el modal
  const resetForm = () => {
    form.resetFields();
    setFiles([]);
  };

  const validarArchivo = (file: File): boolean => {
    const extensionesPermitidas = [".jpg", ".jpeg", ".png", ".pdf"];
    const extension = "." + file.name.toLowerCase().split(".").pop();

    if (!extensionesPermitidas.includes(extension)) {
      notification.error({
        message: "Tipo de archivo no válido",
        description: `Solo se permiten: ${extensionesPermitidas.join(", ")}`,
      });
      return false;
    }

    const tiposMimePermitidos = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (!tiposMimePermitidos.includes(file.type)) {
      notification.error({
        message: "Tipo de archivo no válido",
        description: "El archivo no es un JPG, PNG o PDF válido",
      });
      return false;
    }

    const tamanoMaximo = 1024 * 1024 * 1024; // 1GB
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
        return Upload.LIST_IGNORE;
      }
      return false; // evitar subida automática
    },
    onChange: ({ fileList }) => {
      setFiles(fileList);
    },
    onRemove: (file) => {
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    fileList: files,
    disabled: loading,
  };

  const handleConfirmar = async () => {
    try {
      // Validar el formulario
      const values = await form.validateFields();

      // Validar que haya al menos un archivo si la actividad está completada
      if (esCompletada && files.length === 0) {
        notification.warning({
          message: "Archivos requeridos",
          description: "Debe subir al menos un archivo",
        });
        return;
      }

      setLoading(true);

      const formData = new FormData();

      // Datos básicos de la actividad
      formData.append("id", String(actividad.id));
      formData.append("codigo_proyecto", String(actividad.codigo_proyecto));
      formData.append("codigo_documento", String(actividad.codigo_documento));
      formData.append("etapa", String(actividad.etapa));
      formData.append("actividad_id", String(actividad.actividad_id));
      
      if (actividad.actividad_depende_id) {
        formData.append("actividad_depende_id", String(actividad.actividad_depende_id));
      }
      
      formData.append("tipo", actividad.tipo || "");
      formData.append("orden", String(actividad.orden));
      formData.append("fecha_proyeccion", actividad.fecha_proyeccion || "");
      formData.append("fecha_actual", actividad.fecha_actual || "");
      
      // Usar la fecha del formulario (la que selecciona el usuario)
      if (values.fecha_confirmacion) {
        formData.append(
          "fecha_confirmacion",
          values.fecha_confirmacion.format("YYYY-MM-DD")
        );
      } else {
        // Si no hay fecha seleccionada, usar fecha actual
        formData.append("fecha_confirmacion", dayjs().format("YYYY-MM-DD"));
      }
      
      formData.append("operador", String(actividad.operador || ""));
      formData.append("actividad_nombre", actividad.actividad?.actividad || "");
      formData.append(
        "observacion",
        values.observacion?.trim() ? values.observacion : "Sin observación"
      );
      formData.append("estado", "2");

      // Agregar múltiples archivos
      files.forEach((file) => {
        if (file.originFileObj) {
          formData.append("archivos[]", file.originFileObj);
        }
      });

      // Enviar petición
      const response = await fetch(`${BASE_URL}gestion-documentos-confirmar-celsia`, {
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
          message: "Éxito",
          description: result.message || "Actividad confirmada exitosamente",
          duration: 3,
        });

        // Limpiar y cerrar
        resetForm();
        onConfirm();
        onClose();
      } else {
        throw new Error(result.message || "Error al confirmar la actividad");
      }
    } catch (error: any) {
      console.error("Error al confirmar:", error);
      
      // Manejo específico de errores de validación
      if (error.errorFields) {
        notification.error({
          message: "Error de validación",
          description: "Por favor, complete todos los campos requeridos",
        });
      } else {
        notification.error({
          message: "Error",
          description: error.message || "No se pudo confirmar la actividad",
          duration: 4,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Resetear formulario cuando se abre el modal
  const afterOpenChange = (open: boolean) => {
    if (open) {
      // Establecer fecha actual por defecto en el DatePicker
      form.setFieldsValue({
        fecha_confirmacion: dayjs(),
      });
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: "1.2rem", fontWeight: 500 }}>
          Confirmar Actividad: {actividad?.actividad?.actividad}
        </span>
      }
      open={visible}
      onCancel={handleCancel}
      afterOpenChange={afterOpenChange}
      width={600}
      destroyOnClose
      footer={[
        <Button 
          key="cancel" 
          onClick={handleCancel}
          disabled={loading}
        >
          Cancelar
        </Button>,
        <Button
          key="confirm"
          type="primary"
          loading={loading}
          onClick={handleConfirmar}
          style={{
            background: "#52c41a",
            borderColor: "#52c41a",
          }}
        >
          {esCompletada ? "Subir Archivos" : "Confirmar Actividad"}
        </Button>,
      ]}
    >
      <Form 
        form={form} 
        layout="vertical"
        initialValues={{
          fecha_confirmacion: dayjs(),
        }}
      >
        {/* Campo de fecha - Siempre visible cuando no está completada */}
        {!esCompletada && (
          <Form.Item
            name="fecha_confirmacion"
            label="Fecha de Confirmación"
            rules={[
              {
                required: true,
                message: "La fecha de confirmación es obligatoria",
              },
            ]}
            tooltip="Seleccione la fecha en que se está confirmando esta actividad"
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
              format="DD/MM/YYYY"
              placeholder="Seleccione fecha"
              allowClear={false}
              disabled={loading}
            />
          </Form.Item>
        )}

        {/* Campo de observación - Siempre visible cuando no está completada */}
        {!esCompletada && (
          <Form.Item
            name="observacion"
            label="Observación"
            tooltip="Puede agregar comentarios adicionales sobre la actividad"
          >
            <Input.TextArea
              rows={4}
              placeholder="Ingrese observaciones sobre la actividad (opcional)..."
              maxLength={500}
              showCount
              disabled={loading}
            />
          </Form.Item>
        )}

        {/* Campo de archivos */}
        <Form.Item
          label={
            <span>
              {esCompletada ? "Archivos requeridos" : "Archivos adicionales (opcional)"}
            </span>
          }
          tooltip="Formatos permitidos: JPG, JPEG, PNG, PDF. Tamaño máximo: 1GB"
          required={esCompletada}
        >
          <Upload {...uploadProps}>
            <Button 
              icon={<UploadOutlined />} 
              disabled={loading}
            >
              Seleccionar archivos
            </Button>
          </Upload>
          <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
            <p>• Formatos: JPG, JPEG, PNG, PDF</p>
            <p>• Tamaño máximo: 1GB por archivo</p>
            <p>• Puede seleccionar múltiples archivos</p>
            {esCompletada && (
              <p style={{ color: "#ff4d4f" }}>• Al menos un archivo es requerido</p>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};