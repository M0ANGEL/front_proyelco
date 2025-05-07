import { NotaDebitoCabecera, Privilegios } from "@/services/types";

export interface Props {
  privilegios?: Privilegios;
  tab: string;
  setLoader: (value: boolean) => void;
}

export interface DataType {
  key: React.Key;
  consecutivo_factura: string;
  bodega: string;
  usuario: string;
  tercero: string;
  fecha: string;
  consecutivo: string;
  observacion: string;
  total: string;
}

export interface Pagination {
  data: NotaDebitoCabecera[];
  per_page: number;
  total: number;
}
