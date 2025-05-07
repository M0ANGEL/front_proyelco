import { NotaCreditoFVEDisCabecera, Privilegios } from "@/services/types";

export interface Props {
  privilegios?: Privilegios;
  tab: string;
  setLoader: (value: boolean) => void;
}

export interface DataType {
  key: React.Key;
  numero_factura: string;
  bodega: string;
  usuario: string;
  cliente: string;
  fecha: string;
  numero_nota: string;
  observacion: string;
  cufe: string;
  total: string;
  consecutivo: string;
  estado_dian: string
}

export interface Pagination {
  data: NotaCreditoFVEDisCabecera[];
  per_page: number;
  total: number;
}
