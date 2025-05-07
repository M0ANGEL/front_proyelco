import { NotaCreditoFVEDisCabecera, NotasCreditoFE } from "@/services/types";
import React from "react";

export interface DataType {
  key: React.Key,
  id: number,
  consecutivo: string,
  numero_factura_vta: string,
  estado: string,
  // convenio_id: string,
  nit: string,
  bod_nombre: string,
  total: string,
  num_contrato: string,
  fecha: string,
  impuesto: string,
  subtotal: string,
  created_at: string,
}

export interface Pagination {
  data: NotasCreditoFE[];
  per_page: number;
  total: number;
}
