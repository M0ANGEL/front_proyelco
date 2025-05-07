import { Privilegios, RemisionVentaDirectaCabecera } from "@/services/types";

export interface Props {
  privilegios?: Privilegios;
  tab: string;
  setLoader: (value: boolean) => void;
}

export interface DataType {
  key: React.Key;
  bodega: string;
  usuario: string;
  tercero: string;
  total: string;
  fecha: string;
  consecutivo: string;
  observacion: string;
  estado_facturacion: string;
}

export interface Pagination {
  data: RemisionVentaDirectaCabecera[];
  per_page: number;
  total: number;
}
