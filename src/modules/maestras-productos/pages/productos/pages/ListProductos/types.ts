import { Producto } from "@/services/types";

export interface DataType {
  key: number;
  descripcion: string;
  estado: string;
}

export interface Pagination {
  data: Producto[];
  per_page: number;
  total: number;
}
