import { DataType } from "../../pages/ListBodegas/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  bodegas: DataType[];
}
