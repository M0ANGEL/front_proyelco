import React, { useState } from 'react';
import { Avatar, Dropdown, MenuProps, Spin } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined, 
  UserSwitchOutlined,
  CameraOutlined,
  KeyOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/auth.types';

interface UserAvatarProps {
  user: User | null;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 32 }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false); // estado de animación

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    if (!name) return '#1890ff';
    const colors = ['#f56a00','#7265e6','#ffbf00','#00a2ae','#87d068','#108ee9','#eb2f96','#fa541c'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleLogout = async () => {
    setLoggingOut(true); // activa animación
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setLoggingOut(false);
      console.error('Error cerrando sesión', err);
    }
  };

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserSwitchOutlined />, label: 'Mi Perfil', onClick: () => navigate('/profile') },
    { key: 'upload-photo', icon: <CameraOutlined />, label: 'Subir Foto', onClick: () => console.log('Subir foto') },
    { key: 'change-password', icon: <KeyOutlined />, label: 'Cambiar Contraseña', onClick: () => navigate('/change-password') },
    { type: 'divider' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Configuración', onClick: () => navigate('/settings') },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Cerrar Sesión', onClick: handleLogout, danger: true },
  ];

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <Avatar size={size} icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
        <span style={{ color: '#fff', fontWeight: 'bold' }}>Usuario</span>
      </div>
    );
  }

  const userDisplay = (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '6px',
        transition: 'background-color 0.3s',
        opacity: loggingOut ? 0.5 : 1, // fade-out ligero
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <Avatar 
        size={size}
        style={{ backgroundColor: getAvatarColor(user.nombre), verticalAlign: 'middle' }}
        gap={2}
      >
        {loggingOut ? <Spin indicator={<LoadingOutlined spin style={{ fontSize: size / 2, color: 'white' }} />} /> : getInitials(user.nombre)}
      </Avatar>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px', lineHeight: '1.2' }}>
          {user.nombre.split(' ')[0]}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', lineHeight: '1.2' }}>
          {user.rol}
        </span>
      </div>
    </div>
  );

  return (
    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
      {userDisplay}
    </Dropdown>
  );
};

export default UserAvatar;
