// components/global/GlobalCard.tsx
import React from 'react';
import { Card, CardProps } from 'antd';

interface GlobalCardProps extends CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'documents';
}

export const GlobalCard: React.FC<GlobalCardProps> = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const getCardClassName = () => {
    if (variant === 'documents') {
      return `styled-card-documents ${className}`;
    }
    return className;
  };

  return (
    <Card
      className={getCardClassName()}
      style={{
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }}
      {...props}
    >
      {children}
    </Card>
  );
};