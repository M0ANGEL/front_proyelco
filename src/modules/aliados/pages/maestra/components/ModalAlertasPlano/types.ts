import { AlertasPlano } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean,  alertas: AlertasPlano[]) => void;
  alertas: AlertasPlano[];
}

export interface DataType {
  key: React.Key;
  celda: string;
  mensaje: string;
}
