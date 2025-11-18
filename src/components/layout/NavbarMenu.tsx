// NavbarMenu mejorado
import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Drawer, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { 
  DownOutlined, 
  MoreOutlined, 
  FolderOutlined, 
  FileOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, MenuItem } from '../../types/auth.types';
import { getModuleIcon } from '../../config/module-icons.config';

interface NavbarMenuProps {
  user: User | null;
}

const NavbarMenu: React.FC<NavbarMenuProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Detectar tamaño de pantalla mejorado
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!user || !user.perfiles || user.perfiles.length === 0) {
    return null;
  }

  // Tomamos el primer perfil
  const perfil = user.perfiles[0];
  const menuItems = perfil.menu || [];

  const handleMenuClick = (key: string) => {
    navigate(key);
    setDrawerVisible(false);
  };

  // Función recursiva para construir menús anidados
  const buildMenuItems = (items: MenuItem[]): MenuProps['items'] => {
    return items
      .sort((a, b) => a.order - b.order)
      .map(item => {
        const hasChildren = item.children && item.children.length > 0;
        
        if (hasChildren) {
          return {
            key: item.key,
            label: item.label,
            icon: <FolderOutlined />,
            children: buildMenuItems(item.children!),
          };
        } else {
          return {
            key: item.key,
            label: item.label,
            icon: <FileOutlined />,
            onClick: () => handleMenuClick(item.key),
          };
        }
      });
  };

  // Construir items para el menú lateral (Drawer)
  const buildDrawerMenuItems = (items: MenuItem[]): MenuProps['items'] => {
    return items
      .sort((a, b) => a.order - b.order)
      .map(item => {
        const hasChildren = item.children && item.children.length > 0;
        const moduleIcon = getModuleIcon(item.cod_modulo);
        
        if (hasChildren) {
          return {
            key: item.key,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {moduleIcon}
                {item.label}
              </div>
            ),
            children: buildDrawerMenuItems(item.children!),
          };
        } else {
          return {
            key: item.key,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {moduleIcon}
                {item.label}
              </div>
            ),
            onClick: () => handleMenuClick(item.key),
          };
        }
      });
  };

  // Para desktop: combinamos todos los módulos
  const allModules = [...menuItems];
  
  // Función mejorada para contar módulos visibles
  const getVisibleModulesCount = () => {
    if (window.innerWidth >= 1200) return 5;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    return 0;
  };

  const visibleModules = allModules.slice(0, getVisibleModulesCount());
  const hiddenModules = allModules.slice(getVisibleModulesCount());

  // Componente para items del menú desktop
  const renderDesktopMenuItem = (module: MenuItem) => {
    const hasChildren = module.children && module.children.length > 0;
    const moduleIcon = getModuleIcon(module.cod_modulo);
    const isActive = location.pathname.startsWith(module.key);
    
    if (hasChildren) {
      return (
        <Dropdown
          key={module.key}
          menu={{ 
            items: buildMenuItems([module]) 
          }}
          placement="bottomLeft"
          trigger={['hover', 'click']}
        >
          <div
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.3s',
              whiteSpace: 'nowrap',
              backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              fontSize: isTablet ? '13px' : '14px',
              minWidth: 'fit-content',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isActive ? 'rgba(255,255,255,0.2)' : 'transparent';
            }}
          >
            <span style={{ fontSize: '12px' }}>
              {moduleIcon}
            </span>
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '120px'
            }}>
              {module.label}
            </span>
            <DownOutlined style={{ fontSize: '10px', flexShrink: 0 }} />
          </div>
        </Dropdown>
      );
    } else {
      return (
        <div
          key={module.key}
          onClick={() => handleMenuClick(module.key)}
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            borderRadius: '4px',
            backgroundColor: location.pathname === module.key ? 'rgba(255,255,255,0.2)' : 'transparent',
            transition: 'background-color 0.3s',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: isTablet ? '13px' : '14px',
            minWidth: 'fit-content',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = location.pathname === module.key ? 'rgba(255,255,255,0.2)' : 'transparent';
          }}
        >
          <span style={{ fontSize: '12px' }}>
            {moduleIcon}
          </span>
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '120px'
          }}>
            {module.label}
          </span>
        </div>
      );
    }
  };

  // Render para mobile
  if (isMobile) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined />}
          style={{
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            flexShrink: 0
          }}
          onClick={() => setDrawerVisible(true)}
        />
        
        <Drawer
          title="Menú de Navegación"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={280}
          styles={{
            body: { padding: '0' }
          }}
        >
          <Menu
            mode="inline"
            items={buildDrawerMenuItems(allModules)}
            selectedKeys={[location.pathname]}
            style={{ border: 'none' }}
          />
        </Drawer>
      </>
    );
  }

  // Render para desktop y tablet
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '4px',
      flex: 1,
      justifyContent: 'center',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      minWidth: 0
    }}>
      {/* Módulos visibles */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        flex: 1,
        justifyContent: 'center'
      }}>
        {visibleModules.map(renderDesktopMenuItem)}
      </div>

      {/* Dropdown para módulos ocultos (si hay más de los visibles) */}
      {hiddenModules.length > 0 && (
        <Dropdown
          menu={{ 
            items: buildMenuItems(hiddenModules)
          }}
          placement="bottomLeft"
          trigger={['hover', 'click']}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            style={{
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: isTablet ? '13px' : '14px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              padding: '6px 8px'
            }}
          >
            Más
            <DownOutlined style={{ fontSize: '10px' }} />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

export default NavbarMenu;