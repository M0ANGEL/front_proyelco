import { Convenio } from "@/services/types";

export interface DataType {
  key: number;
  nombre: string;
  razon_soc: string;
  fec_ini: Date;
  fec_fin: Date;
  estado: string;
}

export interface Pagination {
  data: Convenio[];
  per_page: number;
  total: number;
}
