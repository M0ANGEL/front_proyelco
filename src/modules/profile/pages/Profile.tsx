import React from 'react';
import { Card, Descriptions, Tag, Typography } from 'antd';
import { useAuth } from '../../../hooks/useAuth';
import UserAvatar from '../../../components/ui/UserAvatar';

const { Title } = Typography;

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Perfil de Usuario</Title>
      
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
          <UserAvatar user={user} size={80} />
          <div>
            <Title level={3} style={{ margin: 0 }}>{user?.nombre}</Title>
            <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>{user?.username}</p>
            <Tag color="blue" style={{ marginTop: '8px' }}>
              {user?.cargo}
            </Tag>
          </div>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Cédula">
            {user?.cedula}
          </Descriptions.Item>
          <Descriptions.Item label="Nombre completo">
            {user?.nombre}
          </Descriptions.Item>
          <Descriptions.Item label="Usuario">
            {user?.username}
          </Descriptions.Item>
          <Descriptions.Item label="Cargo">
            {user?.cargo}
          </Descriptions.Item>
          <Descriptions.Item label="Rol">
            {user?.rol}
          </Descriptions.Item>
          <Descriptions.Item label="Teléfono">
            {user?.telefono}
          </Descriptions.Item>
          <Descriptions.Item label="Correo">
            {user?.correo || 'No especificado'}
          </Descriptions.Item>
          <Descriptions.Item label="Último acceso">
            {user?.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            <Tag color={user?.estado === 1 ? 'green' : 'red'}>
              {user?.estado === 1 ? 'Activo' : 'Inactivo'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Profile;