// components/global/SaveButton.tsx
import React from 'react';
import { Button } from 'antd';
import { SaveOutlined, LoadingOutlined } from '@ant-design/icons';

interface SaveButtonProps {
  loading?: boolean;
  disabled?: boolean;
  text?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  loading = false,
  disabled = false,
  text = "Guardar",
  htmlType = "submit",
  onClick
}) => {
  return (
    <Button
      htmlType={htmlType}
      type="primary"
      icon={loading ? <LoadingOutlined /> : <SaveOutlined />}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      style={{
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {text}
    </Button>
  );
};