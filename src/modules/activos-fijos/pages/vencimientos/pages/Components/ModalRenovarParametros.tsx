import { Modal, Form, DatePicker, Select, Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { FC } from 'react';
import { RenovarParametros } from '@/services/activos/vencimientosAPI';

const { Option } = Select;

interface RenovarMantenimientoModalProps {
  visible: boolean;
  onCancel: () => void;
  idUsuarioFijo: number; // ID del usuario fijo
  idActivo: number; // ID del activo
  tipoMantenimiento: string;

}

const ModalRenovarParametros: FC<RenovarMantenimientoModalProps> = ({ visible, onCancel, idUsuarioFijo, idActivo, tipoMantenimiento}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]); // Estado para gestionar el archivo subido

  // Manejar el cambio en el upload para capturar el archivo
  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // Método para manejar el envío al backend
  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // Obtener los valores validados del formulario
      form.resetFields(); // Reseteamos los campos después de validar

      // Crear un objeto FormData para el envío al backend
      const formData = new FormData();
      formData.append('id_activo', idActivo.toString()); // Convertir a string si es necesario
      formData.append('fecha_mantenimiento', values.fecha_mantenimiento.format('YYYY-MM-DD')); // Formateamos la fecha
      formData.append('archivo', fileList[0].originFileObj);
      formData.append('tipo_mantenimiento', tipoMantenimiento); // O 'tecnomecanica', dependiendo de tu lógica

      // Llamada al backend con el FormData
      await RenovarParametros(formData, idUsuarioFijo, idActivo);

      notification.success({ message: 'Mantenimiento renovado con éxito' });
      onCancel(); // Cerrar el modal después de enviar
    } catch (error) {
      notification.error({ message: 'Error al renovar mantenimiento' });
    }
  };

  return (
    <Modal
      title="Renovación de parametro "
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Enviar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="fecha_mantenimiento"
          label="Fecha nueva parametro"
          rules={[{ required: true, message: 'Por favor selecciona la fecha del parametro' }]}
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

export default ModalRenovarParametros;
