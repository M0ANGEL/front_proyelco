import { MenuProps } from 'antd';

export const dropdownMenuStyle: MenuProps['style'] = {
  maxHeight: '400px',
  overflowY: 'auto',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

export const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
};

export const subMenuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px 6px 24px',
  fontSize: '13px',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
};