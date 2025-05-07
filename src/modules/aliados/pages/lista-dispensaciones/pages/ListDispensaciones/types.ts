import { DispensacionAliadoCabecera } from "@/services/types";

export interface DataType {
  key: React.Key;
  consecutivo: string;
  punto_entrega: string;
  fecha_documento: string;
  fecha_cargue: string;
  estado_auditoria: string;
  aliado_nombre: string;
  aliado_id: string;
  observacion_auditoria: string;
  has_files: boolean;
}

export interface Pagination {
  data: DispensacionAliadoCabecera[];
  per_page: number;
  total: number;
}
