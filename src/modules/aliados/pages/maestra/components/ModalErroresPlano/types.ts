import { ErroresPlano } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  errores: ErroresPlano[];
}

export interface DataType {
  key: React.Key;
  celda: string;
  mensaje: string;
}
