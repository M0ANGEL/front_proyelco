import { Aliado } from "@/services/types";

export interface DataType {
  key: React.Key;
  aldo_nombre: string;
  convenio: string;
  estado: string;
}

export interface Pagination {
  data: Aliado[];
  per_page: number;
  total: number;
}
