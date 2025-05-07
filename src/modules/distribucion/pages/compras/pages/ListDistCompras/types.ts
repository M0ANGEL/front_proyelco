import { DistribucionCabecera } from "@/services/types";

export interface DataType {
  key: React.Key;
  nombre: string;
  consecutivo: string;
  estado: string;
  cantidad_total: number;
  cantidad_trasladada: number;
  porcentaje_traslados: number;
}

export interface Pagination {
  data: DistribucionCabecera[];
  per_page: number;
  total: number;
}
