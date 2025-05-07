import {  FacturaFVE, FacturaFVEDetalle, ListRadicacion } from "@/services/types";
import React from "react";

export interface DataType {
  key:React.Key;
  id:number;
  consecutivos?:string;
  estado_id:string;
  fecha_emision:Date;
  fecha_vencimiento:Date;
  impuesto:string;
  nit:string;
  num_contrato:string;
  numero_factura_vta:string;
  numero_fve:string;
  subtotal:string;
  total:string;
  // tercero:string;
  // bodega: string;
  // consecutivo_id: string;
  // fecha_facturacion: Date;
  razon_soc: string;
  bod_nombre: string;
  // cta_radicado:string;
  // descripcion:string;
  numero_nota_credito?:string;
  fve_dis_id:string;
  fve_cabecera:string;
  convenio_id:string;
  convenio:string;
  nro_factura:string;
}

export interface Pagination {
  data: FacturaFVE[];
  per_page: number;
  total: number;
  page:number;
}
