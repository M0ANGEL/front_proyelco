import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Descriptions,
  Form,
  Input,
  Button,
  Upload,
  Modal,
  message,
  Space,
  Divider,
  Spin,
  Alert,
  Image,
  notification
} from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  LockOutlined,
  SaveOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';
import { BASE_URL, FILES_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";
import type { UploadProps } from 'antd';
import { UserData } from '@/types/auth.types';
import { fetchUserProfile } from '@/services/auth/loguinAPI';
import { cambiarContrasena } from '@/services/auth/usuarioPerfil';

const { Title, Text } = Typography;
const { Password } = Input;

interface PasswordForm {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const ProfilePage: React.FC = () => {
  const { user: authUser, logout: authLogout } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<UserData>();
  const [imageProfile, setImageProfile] = useState<string>('./default.png');
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  // Cargar datos del usuario
  useEffect(() => {
    fetchUserProfile()
      .then(({ data }) => {
        setUser(data.userData);
        if (data.userData.image && !data.userData.image.includes("default")) {
          setImageProfile(`${FILES_URL}${data.userData.image}`);
        }
      })
      .catch((error) => {
        api.error({
          message: error.error || 'Error al cargar el perfil',
          placement: "bottomRight",
        });
      });
  }, []);

  // 🔧 FUNCIÓN PARA LIMPIAR COMPLETAMENTE EL LOCALSTORAGE
  const clearLocalStorage = () => {
    try {
      // Limpiar todos los items relacionados con autenticación
      const itemsToRemove = [
        'auth_token',
        'refresh_token',
        'user_rol',
        'encrypted_user_data',
        'encryption_key',
        'user_data',
        'token',
        'user_identifier'
      ];

      itemsToRemove.forEach(item => {
        localStorage.removeItem(item);
      });

    } catch (error) {
      console.error('❌ Error limpiando localStorage:', error);
    }
  };

  // Configuración del upload
  const uploadProps: UploadProps = {
    name: "image",
    action: `${BASE_URL}usuarios/perfiles/imagen`,
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
    maxCount: 1,
    accept: "image/png, image/jpeg, image/jpg",
    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('La imagen no puede ser mayor a 2MB!');
        return false;
      }

      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error('Solo se admiten los formatos .png, .jpg y .jpeg');
        return false;
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        setUploading(true);
        return;
      }
      
      if (info.file.status === 'done') {
        setUploading(false);
        setImageProfile(`${FILES_URL}${info.file.response.data}`);
        message.success('Foto de perfil actualizada correctamente');
      } else if (info.file.status === 'error') {
        setUploading(false);
        api.error({
          message: info.file.response?.data?.error || 'Error al subir la imagen',
          placement: "bottomRight",
        });
      }
    },
  };

  // 🚀 MANEJAR CAMBIO DE CONTRASEÑA - CORREGIDO
  const handlePasswordChange = async (values: PasswordForm) => {
    if (values.password !== values.password_confirmation) {
      message.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await cambiarContrasena(values, user?.id);
      
      api.success({
        message: response.data.message,
        placement: "bottomRight",
      });
      
      form.resetFields();
      
      // 🔒 LIMPIAR TODO Y CERRAR SESIÓN
      Modal.confirm({
        title: "Contraseña Cambiada Exitosamente",
        keyboard: false,
        icon: <ExclamationCircleOutlined />,
        content: "Por seguridad, se cerrará la sesión y se limpiarán todos los datos. Debes iniciar sesión nuevamente.",
        okText: "Entendido",
        cancelButtonProps: { style: { display: 'none' } },
        onOk: async () => {
          try {
            // 1. Limpiar localStorage completamente
            clearLocalStorage();
            
            // 2. Ejecutar logout del auth context
            await authLogout();
            
            // 3. Mostrar mensaje final
            message.success('Sesión cerrada. Redirigiendo al login...');
            
            // 4. Redirigir al login
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 1000);
            
          } catch (error) {
            console.error('Error durante el logout:', error);
            // Si hay error, igual redirigir al login
            navigate('/login', { replace: true });
          }
        },
      });
    } catch (error: any) {
      const response = error.response?.data;
      api.error({
        message: response?.error || 'Error al cambiar la contraseña',
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // Validación personalizada para confirmar contraseña
  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Las contraseñas no coinciden'));
    },
  });

  return (
    <div style={{ width: "90%", margin: '0 auto', padding: '24px' }}>
      {contextHolder}

      <Row gutter={[32, 32]}>
        {/* Columna izquierda - Información del usuario */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                Información Personal
              </Space>
            }
            style={{ height: '100%' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Space direction="vertical" size="large">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Image
                    src={imageProfile}
                    preview={false}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      border: '4px solid #f0f0f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      objectFit: 'cover'
                    }}
                    fallback="./default.png"
                  />
                  <Upload {...uploadProps}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={uploading ? <LoadingOutlined /> : <CameraOutlined />}
                      size="small"
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                      loading={uploading}
                    />
                  </Upload>
                </div>
                
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    {user?.nombre || authUser?.nombre}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>
                    @{user?.username || authUser?.username}
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag 
                      color="blue" 
                      style={{ 
                        fontSize: '14px',
                        padding: '4px 12px',
                        borderRadius: '16px'
                      }}
                    >
                      {user?.cargo || authUser?.cargo}
                    </Tag>
                  </div>
                </div>
              </Space>
            </div>

            <Descriptions 
              bordered 
              column={1}
              size="middle"
              labelStyle={{ 
                fontWeight: 600,
                background: '#fafafa',
                width: '140px'
              }}
            >
              <Descriptions.Item label="Cédula">
                <Text strong>{user?.cedula || authUser?.cedula}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Nombre completo">
                {user?.nombre || authUser?.nombre}
              </Descriptions.Item>
              
              <Descriptions.Item label="Usuario">
                {user?.username || authUser?.username}
              </Descriptions.Item>
              
              <Descriptions.Item label="Cargo">
                {user?.cargo || authUser?.cargo}
              </Descriptions.Item>
              
              <Descriptions.Item label="Rol">
                <Tag color="purple">{user?.rol || authUser?.rol}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Teléfono">
                {user?.telefono || authUser?.telefono || 'No especificado'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Correo electrónico">
                <Text type={(user?.correo || authUser?.correo) ? undefined : 'secondary'}>
                  {user?.correo || authUser?.correo || 'No especificado'}
                </Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Último acceso">
                <Text type="success">
                  {user?.last_login 
                    ? new Date(user.last_login).toLocaleString('es-ES')
                    : authUser?.last_login
                    ? new Date(authUser.last_login).toLocaleString('es-ES')
                    : 'N/A'
                  }
                </Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Estado">
                <Tag 
                  color={(user?.estado || authUser?.estado) === 1 ? 'green' : 'red'}
                  icon={(user?.estado || authUser?.estado) === 1 ? undefined : <SafetyCertificateOutlined />}
                >
                  {(user?.estado || authUser?.estado) === 1 ? 'Activo' : 'Inactivo'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Columna derecha - Cambio de contraseña */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LockOutlined />
                Cambiar Contraseña
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Alert
              message="Requisitos de contraseña"
              description="La contraseña debe tener entre 6 y 8 caracteres. Puede ser cualquier combinación de caracteres."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Spin spinning={loading} indicator={<LoadingOutlined spin />}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handlePasswordChange}
                disabled={loading}
              >
                <Form.Item
                  name="current_password"
                  label="Contraseña actual"
                  rules={[
                    { required: true, message: 'Por favor ingresa tu contraseña actual' },
                    { min: 6, message: 'Mínimo 6 caracteres' },
                    { max: 8, message: 'Máximo 8 caracteres' }
                  ]}
                >
                  <Password
                    placeholder="Ingresa tu contraseña actual"
                    prefix={<LockOutlined />}
                    size="large"
                    maxLength={8}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Nueva contraseña"
                  rules={[
                    { required: true, message: 'Por favor ingresa la nueva contraseña' },
                    { min: 6, message: 'Mínimo 6 caracteres' },
                    { max: 8, message: 'Máximo 8 caracteres' }
                  ]}
                >
                  <Password
                    placeholder="Ingresa la nueva contraseña (6-8 caracteres)"
                    prefix={<LockOutlined />}
                    size="large"
                    maxLength={8}
                  />
                </Form.Item>

                <Form.Item
                  name="password_confirmation"
                  label="Confirmar contraseña"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Por favor confirma tu contraseña' },
                    { min: 6, message: 'Mínimo 6 caracteres' },
                    { max: 8, message: 'Máximo 8 caracteres' },
                    validateConfirmPassword
                  ]}
                >
                  <Password
                    placeholder="Confirma tu nueva contraseña"
                    prefix={<LockOutlined />}
                    size="large"
                    maxLength={8}
                  />
                </Form.Item>

                <Divider />

                <Form.Item style={{ marginBottom: 0 }}>
                  <Space size="middle">
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={loading}
                      size="large"
                      style={{ minWidth: 120 }}
                    >
                      {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </Button>
                    
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => form.resetFields()}
                      size="large"
                      disabled={loading}
                    >
                      Limpiar
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Spin>

            {/* Información adicional */}
            <div style={{ marginTop: 32, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
              <Title level={5} style={{ marginBottom: 8 }}>
                🔒 Medida de Seguridad
              </Title>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#666' }}>
                <li>Al cambiar la contraseña, la sesión actual se cerrará automáticamente</li>
                <li>Todos los datos locales se limpiarán por seguridad</li>
                <li>Debes iniciar sesión nuevamente con tu nueva contraseña</li>
                <li>Esta medida protege tu cuenta contra accesos no autorizados</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;