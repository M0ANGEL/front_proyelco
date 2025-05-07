import { ErroresGlosas } from "../../pages/FormGlosas/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  errores: ErroresGlosas[];
}

export interface DataType {
  key: React.Key;
  celda: string;
  mensaje: string;
}
