import { Flex, Rate } from 'antd';
import { Controller } from 'react-hook-form';

const desc = ['Terrible', 'Malo', 'Normal', 'Bien', 'Maravilloso'];

interface TkEstrellasProps {
  name: string;
  control: any;
}

export const TkEstrellas = ({ name, control }: TkEstrellasProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Flex gap="middle" vertical >
          <Rate {...field} tooltips={desc} value={field.value || 0} style={{background: "#eaeaea", borderRadius: "10px", padding: "5px", textAlign: "center"}} />
          {field.value ? <b style={{textAlign: "center"}}><span >{desc[field.value - 1]}</span></b> : null}
        </Flex>
      )}
    />
  );
};
