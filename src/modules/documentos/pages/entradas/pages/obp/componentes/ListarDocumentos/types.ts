import { ObsequioProveedorCabecera, Privilegios } from "@/services/types";

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
  data: ObsequioProveedorCabecera[];
  per_page: number;
  total: number;
}
