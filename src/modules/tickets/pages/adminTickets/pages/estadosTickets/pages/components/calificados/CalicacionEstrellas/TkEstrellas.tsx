import { Rate } from 'antd';


interface TkEstrellasProps {
  value: string;
}


export  const TkEstrellas = ({value}:TkEstrellasProps) => {
  return(
    <Rate disabled  value={Number(value)} />
  )
};

