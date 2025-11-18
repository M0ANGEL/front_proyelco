import React from 'react';
import { Card, Form, Switch, Select, Button, message } from 'antd';

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      // Aquí iría la llamada a la API para guardar configuraciones
      message.success('Configuraciones guardadas exitosamente');
    } catch (error) {
      message.error('Error al guardar configuraciones');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card title="Configuración">
        <Form
          form={form}
          name="settings"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            notifications: true,
            theme: 'light',
            language: 'es'
          }}
        >
          <Form.Item
            label="Notificaciones"
            name="notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Tema"
            name="theme"
          >
            <Select>
              <Select.Option value="light">Claro</Select.Option>
              <Select.Option value="dark">Oscuro</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Idioma"
            name="language"
          >
            <Select>
              <Select.Option value="es">Español</Select.Option>
              <Select.Option value="en">English</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar Configuración
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;