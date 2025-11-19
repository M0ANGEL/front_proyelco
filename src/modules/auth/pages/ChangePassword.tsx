import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      // Aquí iría la llamada a la API para cambiar la contraseña
      message.success('Contraseña cambiada exitosamente');
      form.resetFields();
    } catch (error) {
      message.error('Error al cambiar la contraseña');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Card title="Cambiar Contraseña">
        <Form
          form={form}
          name="change-password"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Contraseña Actual"
            name="currentPassword"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña actual' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nueva Contraseña"
            name="newPassword"
            rules={[
              { required: true, message: 'Por favor ingresa la nueva contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirmar Nueva Contraseña"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Por favor confirma la nueva contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cambiar Contraseña
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;