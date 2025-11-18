// components/global/FormInputs.tsx
import { Select, SelectProps } from 'antd';

interface FormSelectProps extends SelectProps {
  // Props personalizadas si las necesitas
}

export const FormSelect: React.FC<FormSelectProps> = (props) => {
  return <Select {...props} />;
};