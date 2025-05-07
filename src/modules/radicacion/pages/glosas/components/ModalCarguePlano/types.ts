import { IconType } from "antd/es/notification/interface";

export interface Props {
  open: boolean;
  setOpen: (value: boolean, flag_reload: boolean) => void;
}

export interface ResponsePlanoGlosas {
  status: IconType;
  message: string;
  errores: ErroresGlosas[];
}

export interface ErroresGlosas {
  columna: string;
  fila: number;
  message: string;
}
