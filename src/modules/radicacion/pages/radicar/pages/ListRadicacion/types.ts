import { ListRadicacion } from "@/services/types";
import React from "react";

export interface DataType {
  key: React.Key;
  fecha_facturacion: string;
  numero_factura_vta: string;
  consecutivo: string;
  cta_radicado: string;
  descripcion: string;
  total: string;
  nit: string;
}

export interface Pagination {
  data: ListRadicacion[];
  per_page: number;
  total: number;
  page: number;
}
