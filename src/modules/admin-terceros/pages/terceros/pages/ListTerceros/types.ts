import { Tercero } from "@/services/types";

export interface DataType {
  key: number;
  nombre: string;
  nit: string;
  razon_soc: string;
  correo_ele: string;
  // tipo: string;
  telefono: string;
  celular: string;
  estado: string;
}

export interface Pagination {
  data: Tercero[];
  per_page: number;
  total: number;
}
