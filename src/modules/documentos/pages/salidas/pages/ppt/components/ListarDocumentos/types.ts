import { DocumentosCabecera, Privilegios } from "@/services/types";

export interface Props {
  privilegios?: Privilegios;
  tab: string;
}

export interface DataType {
  key: React.Key;
  consecutivo: string;
  consecutivo_docu_vinculado: string;
  bodega: string;
  tercero: string;
  fecha: string;
  usuario: string;
  tipo_documento_id: string;
}

export interface Pagination {
  data: DocumentosCabecera[];
  per_page: number;
  total: number;
}
