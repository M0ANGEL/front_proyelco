import { NotaCreditoFVERvdCabecera, Privilegios } from "@/services/types";

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
  cliente: string;
  fecha: string;
  consecutivo: string;
  observacion: string;
  cufe: string;
  total: string;
}

export interface Pagination {
  data: NotaCreditoFVERvdCabecera[];
  per_page: number;
  total: number;
}
