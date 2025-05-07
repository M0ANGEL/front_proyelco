import { Privilegios, Rqp } from "@/services/types";

export interface Props {
  privilegios?: Privilegios;
  tab: string;
  setLoader: (value: boolean) => void;
  user_rol: string;
}

export interface DataType {
  key: React.Key;
  bod_solicitante: string;
  usuario: string;
  fecha: string;
  consecutivo: string;
  observacion: string;
  fecha_aprobacion: string;
  usuario_aprobacion: string;
}

export interface Pagination {
  data: Rqp[];
  per_page: number;
  total: number;
}
