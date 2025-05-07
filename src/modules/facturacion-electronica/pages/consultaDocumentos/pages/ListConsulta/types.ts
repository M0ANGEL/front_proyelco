import {  FacturaFVE, FacturaFVECabecera, FacturaFVEDetalle } from "@/services/types";
import React from "react";


export interface DataType {
  key:React.Key;
  id: number;
  dispensaciones_id: string;
  consecutivo?:string;
  estado_id: string;
  fecha_emision: Date;
  fecha_vencimiento: Date;
  fecha_facturacion:Date;
  impuesto: string;
  nit: string;
  num_contrato: string;
  numero_factura_vta: string;
  numero_fve: string;
  subtotal: string;
  total: string;
  cufe:string;
  respuesta:string;
  nota: string;
}

export interface Pagination {
  data: FacturaFVE[];
  per_page: number;
  total: number;
}

export interface Convenios {

  idConvenio:number;
  bodega: string;
}