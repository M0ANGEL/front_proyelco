import { DevolucionDispensacionCabecera, Privilegios } from "@/services/types";

export interface Props {
  // documentos: DevolucionDispensacionCabecera[];
  privilegios?: Privilegios;
  tab: string;
  setLoader: (value: boolean) => void;
}

export interface DataType {
  key: React.Key;
  bodega: string;
  usuario: string;
  paciente: string;
  fecha: string;
  consecutivo: string;
  observacion: string;
  fuente: string;
  numero_servinte: string;
}

export interface Pagination {
  data: DevolucionDispensacionCabecera[];
  per_page: number;
  total: number;
}
