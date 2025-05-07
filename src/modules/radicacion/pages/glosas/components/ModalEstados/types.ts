import { SelectProps } from "antd";

export interface Props {
  open: boolean;
  setOpen: (value: boolean, flag: boolean) => void;
  selectEstados: SelectProps["options"];
  facturas: React.Key[];
  id_factura?: React.Key;
}
