import { Tercero } from "@/services/types";

export interface DataType {
  key: React.Key;
  codigo: string;
  motivo: string;
  estado: string;
  motivo_homologado: string;
}

export interface Pagination {
  data: Tercero[];
  per_page: number;
  total: number;
}
