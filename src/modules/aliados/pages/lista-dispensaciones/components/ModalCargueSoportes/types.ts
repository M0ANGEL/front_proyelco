import { SelectProps } from "antd";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  aliado_id?: string;
  selectAliados: SelectProps["options"];
}
