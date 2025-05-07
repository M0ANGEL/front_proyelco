/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductoLote } from "@/services/types";

export interface Props {
  productosLote: ProductoLote[];
  tab: string;
  loader: boolean;
}

export interface DataType {
  key: React.Key;
  codigoInterno: string;
  nombreProducto: string;
  cantidad: string;
  lotes: string;
  vencimientos: string;
  bodega: string;
}

export interface Pagination {
  data: ProductoLote[];
  per_page: number;
  total: number;
  current: number;
}
