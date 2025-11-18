// components/global/SearchBar.tsx
import React from 'react';
import { Input, Button, Space, Select } from 'antd';
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';

interface SearchBarProps {
  onSearch: (value: string) => void;
  onReset?: () => void;
  placeholder?: string;
  filters?: {
    key: string;
    label: string;
    options: { label: string; value: any }[];
    value?: any;
    onChange: (value: any) => void;
  }[];
  showFilterButton?: boolean;
  onFilterClick?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onReset,
  placeholder = "Buscar...",
  filters = [],
  showFilterButton = false,
  onFilterClick,
}) => {
  return (
    <div className="search-bar-container" style={{ 
      background: 'white', 
      padding: '24px', 
      borderRadius: '12px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      marginBottom: '24px'
    }}>
      <Space wrap size="middle" style={{ width: '100%' }}>
        <Input
          placeholder={placeholder}
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: 300, borderRadius: '8px' }}
          allowClear
        />
        
        {filters.map((filter) => (
          <Select
            key={filter.key}
            placeholder={filter.label}
            options={filter.options}
            value={filter.value}
            onChange={filter.onChange}
            style={{ minWidth: 150, borderRadius: '8px' }}
            allowClear
          />
        ))}
        
        <Space>
          {showFilterButton && (
            <Button
              icon={<FilterOutlined />}
              onClick={onFilterClick}
              style={{ borderRadius: '8px' }}
            >
              Filtros
            </Button>
          )}
          
          {onReset && (
            <Button
              icon={<ReloadOutlined />}
              onClick={onReset}
              style={{ borderRadius: '8px' }}
            >
              Limpiar
            </Button>
          )}
        </Space>
      </Space>
    </div>
  );
};