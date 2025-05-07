import { Laboratorios } from "@/services/types";

export interface DataType {
    key: number;
    descripcion: string;
    estado_id: string;
  }

  export interface Pagination {
    data: Laboratorios[];
    per_page: number;
    total: number;
    page:number;
  }