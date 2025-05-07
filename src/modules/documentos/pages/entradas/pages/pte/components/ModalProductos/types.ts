import { DataType } from "../../pages/FormPTE/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSelectProducto: (producto: DataType) => void;
  detalle: DataType[];
}
