import { ConsignacionCabecera, Privilegios } from "@/services/types";

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
  tercero: string;
  fecha: string;
  consecutivo: string;
  total: string;
}

export interface Pagination {
  data: ConsignacionCabecera[];
  per_page: number;
  total: number;
}
