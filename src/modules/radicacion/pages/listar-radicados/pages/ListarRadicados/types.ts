import { Radicacion } from "@/services/types";

export interface Pagination {
  data: Radicacion[];
  per_page: number;
  total: number;
}

export interface DataType {
  key: React.Key;
  cta_radicado: string;
  nro_radicado: string;
  total: number;
  tercero: string;
  fecha_radicado: string;
  fecha_creacion: string;
  usuario: string;
}
