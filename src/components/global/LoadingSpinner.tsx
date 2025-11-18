// components/global/LoadingSpinner.tsx
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
  spinning?: boolean;
  size?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode; // ← AGREGAR ESTA LÍNEA
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  spinning = true,
  size = 40,
  color = "#f4882a",
  backgroundColor = "rgb(251 251 251 / 70%)",
  children
}) => {
  return (
    <Spin
      spinning={spinning}
      indicator={<LoadingOutlined spin style={{ fontSize: size, color }} />}
      style={{ backgroundColor }}
    >
      {children}
    </Spin>
  );
};