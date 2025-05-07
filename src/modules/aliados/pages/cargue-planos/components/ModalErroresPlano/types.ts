import { ErroresAliados } from "../../pages/CarguePlanosPage/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  errores: ErroresAliados[];
}

export interface DataType {
  key: React.Key;
  celda: string;
  mensaje: string;
}
