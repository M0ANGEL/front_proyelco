import { Modal, Form, DatePicker, Select, Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { FC } from 'react';
import { RenovarMantenimiento } from '@/services/activos/mantenimientoAPI';

const { Option } = Select;

interface RenovarMantenimientoModalProps {
  visible: boolean;
  onCancel: () => void;
  recordId: number; // ID del registro del mantenimiento
  idUsuarioFijo: number; // ID del usuario fijo
}

const RenovarMantenimientoModal: FC<RenovarMantenimientoModalProps> = ({ visible, onCancel, recordId, idUsuarioFijo }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]); // Estado para gestionar el archivo subido

  // Manejar el cambio en el upload para capturar el archivo
  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // Método para manejar el envío al backend
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      form.resetFields(); // Reseteamos los campos después de validar

      // Crear un objeto FormData para el envío al backend
      const formData = new FormData();
      formData.append('fecha_mantenimiento', values.fecha_mantenimiento.format('YYYY-MM-DD')); // Formateamos la fecha
      formData.append('fecha_fin_mantenimiento', values.fecha_fin_mantenimiento.format('YYYY-MM-DD'));
      
      // Agregar el archivo seleccionado (solo el primer archivo si hay más de uno)
      if (fileList.length > 0) {
        formData.append('archivo', fileList[0].originFileObj);
      }

      // Llamada al backend con el FormData y los IDs correspondientes
      await RenovarMantenimiento(formData, idUsuarioFijo, recordId);

      notification.success({ message: "Mantenimiento renovado con éxito" });
      onCancel(); // Cerrar el modal después de enviar
    } catch (error) {
      notification.error({ message: 'Error al renovar mantenimiento' });
    }
  };

  return (
    <Modal
      title="Renovación de Mantenimiento"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Enviar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="fecha_mantenimiento"
          label="Fecha de Mantenimiento"
          rules={[{ required: true, message: 'Por favor selecciona la fecha de mantenimiento' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="fecha_fin_mantenimiento"
          label="Fecha Fin de Mantenimiento"
          rules={[{ required: true, message: 'Por favor selecciona la fecha de fin de mantenimiento' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="archivo"
          label="Seleccionar tipo de archivo"
          rules={[{ required: true, message: 'Por favor selecciona un tipo de archivo' }]}
        >
          <Select placeholder="Selecciona un tipo de archivo">
            <Option value="pdf">PDF</Option>
            <Option value="imagen">Imagen</Option>
          </Select>
        </Form.Item>
        <Form.Item name="archivo_subido" label="Subir archivo">
          <Upload
            onChange={handleFileChange}
            beforeUpload={() => false} // Evitar subida automática, lo hacemos manualmente
            fileList={fileList} // Controlamos el archivo a través del estado
          >
            <Button icon={<UploadOutlined />}>Subir (PDF o Imagen)</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RenovarMantenimientoModal;
