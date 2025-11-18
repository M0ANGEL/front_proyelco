import { 
  BankOutlined, 
  TeamOutlined, 
  SettingOutlined, 
  ProjectOutlined,
  UserOutlined,
  ShopOutlined,
  IdcardOutlined,
  ContainerOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { ReactNode } from 'react';

// Mapeo de cod_modulo a iconos
export const MODULE_ICONS: { [key: string]: ReactNode } = {
  // Gestión de Empresas
  'GSTEMP': <BankOutlined />,
  
  // Administración de Usuarios
  'ADMUSU': <TeamOutlined />,
  
  // Configuración del Sistema
  'CFGSIS': <SettingOutlined />,
  
  // Proyectos
  'SLD': <ProjectOutlined />,
  
  // Clientes
  'CLI': <UserOutlined />,
  
  // Configuración Proyectos
  'PMPT': <SettingOutlined />,
  
  // Compras
  'COMPA': <ShopOutlined />,
  
  // Talento Humano
  'TH': <IdcardOutlined />,
  
  // Activos Fijos
  'ACTIV': <ContainerOutlined />,
  
  // Logística
  'LOGI': <BarChartOutlined />,
  
  // Informes
  'PBY': <FileTextOutlined />,
  
  // Extras
  'EXT': <AppstoreOutlined />,
};

// Icono por defecto si no se encuentra el cod_modulo
export const DEFAULT_MODULE_ICON = <AppstoreOutlined />;

// Función para obtener el icono del módulo
export const getModuleIcon = (codModulo: string): ReactNode => {
  return MODULE_ICONS[codModulo] || DEFAULT_MODULE_ICON;
};