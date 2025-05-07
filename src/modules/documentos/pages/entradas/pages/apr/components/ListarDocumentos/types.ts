import { DocumentosCabecera, Privilegios } from "@/services/types";
import React from "react";

export interface Props {
  privilegios?: Privilegios;
  tab: string;
}

export interface DataType {
  key: React.Key;
  consecutivo: string;
  tercero: string;
  fecha: string;
  usuario: string;
  bodega: string;
  documentos_vinculados: DocumentosCabecera[];
  tipo_documento_id: string;
}

export interface Pagination {
  data: DocumentosCabecera[];
  per_page: number;
  total: number;
}
