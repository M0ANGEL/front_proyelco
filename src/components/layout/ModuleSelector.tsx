import React from 'react';
import { Modal, Card, Row, Col, Input, Tag } from 'antd';
import { AppstoreOutlined, SearchOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import { MenuItem } from '../../types/auth.types';
import { getModuleIcon } from '../../config/module-icons.config';

const { Search } = Input;

interface ModuleSelectorProps {
  visible: boolean;
  onClose: () => void;
  onModuleSelect: (module: MenuItem, routeKey: string) => void;
  availableModules: MenuItem[];
  title: string;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  visible,
  onClose,
  onModuleSelect,
  availableModules,
  title
}) => {
  const [searchText, setSearchText] = React.useState('');

  // Función recursiva para aplanar todos los items del menú
  const flattenMenuItems = (items: MenuItem[]): Array<{item: MenuItem, routeKey: string, level: number}> => {
    const flattened: Array<{item: MenuItem, routeKey: string, level: number}> = [];
    
    const flatten = (items: MenuItem[], level = 0) => {
      items.forEach(item => {
        // Solo agregar items que no tengan hijos (rutas finales)
        if (!item.children || item.children.length === 0) {
          flattened.push({ item, routeKey: item.key, level });
        } else {
          // Si tiene hijos, procesarlos recursivamente
          flatten(item.children, level + 1);
        }
      });
    };
    
    flatten(items);
    return flattened;
  };

  const allRoutes = flattenMenuItems(availableModules);
  
  const filteredRoutes = allRoutes.filter(({ item, routeKey }) =>
    item.label.toLowerCase().includes(searchText.toLowerCase()) ||
    item.cod_modulo.toLowerCase().includes(searchText.toLowerCase()) ||
    routeKey.toLowerCase().includes(searchText.toLowerCase())
  );

  const getLevelPadding = (level: number) => {
    return level * 16;
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AppstoreOutlined />
          <span>{title}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Search
        placeholder="Buscar módulos, menus o rutas..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Row gutter={[8, 8]}>
          {filteredRoutes.map(({ item, routeKey, level }) => (
            <Col key={routeKey} span={24}>
              <Card
                hoverable
                size="small"
                onClick={() => onModuleSelect(item, routeKey)}
                style={{ 
                  marginBottom: '4px',
                  borderLeft: `4px solid ${level === 0 ? '#1890ff' : level === 1 ? '#52c41a' : '#faad14'}`
                }}
                bodyStyle={{ 
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ 
                  fontSize: '18px',
                  marginLeft: `${getLevelPadding(level)}px`
                }}>
                  {getModuleIcon(item.cod_modulo)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold',
                    lineHeight: '1.2'
                  }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#666',
                    marginTop: '2px'
                  }}>
                    {routeKey}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag color={level === 0 ? 'blue' : level === 1 ? 'green' : 'orange'} size="small">
                    Nvl {level + 1}
                  </Tag>
                  <FileOutlined style={{ color: '#52c41a' }} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        
        {filteredRoutes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <FileOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
            <div>No se encontraron rutas</div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModuleSelector;