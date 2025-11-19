// components/global/FormInputs.tsx
import React from 'react';
import { Input, InputProps } from 'antd';

interface FormInputProps extends InputProps {
  uppercase?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ uppercase, ...props }) => {
  if (uppercase) {
    return (
      <Input
        style={{ textTransform: 'uppercase' }}
        {...props}
      />
    );
  }
  return <Input {...props} />;
};