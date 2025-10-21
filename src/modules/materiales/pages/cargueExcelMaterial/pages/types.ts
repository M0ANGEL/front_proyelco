import { Paciente } from "@/services/types";

export interface DataType {
    key: number;
    codigo_insumo: string; 
    insumo_Descripcion: string;
    unidad: string;
    mat_requerido: string;
    agrupacion_descripcion: string;
    insumo_descripcion: string;
    nombre_tercero: string;
    prefijo: string;
    created_at: string;
    created_at_string: string;
    updated_at: string;
  }

  export interface Pagination {
    data: Paciente[];
    per_page: number;
    total: number;
  }