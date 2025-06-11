import { Convenio } from "@/services/types";

export interface DataType {
  key: number;
  nombreIngeniero: string;
  nombreEncargado: string;
  descripcion_proyecto: string;
  emp_nombre: string;
  fec_ini: Date;
  fec_fin: Date;
  estado: string;
  porcentaje: string;
  avance: string;
}

export interface Pagination {
  data: Convenio[];
  per_page: number;
  total: number;
}
