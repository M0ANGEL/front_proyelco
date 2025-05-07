import {  FacturaVtaDis, Resolucion } from "@/services/types";
import React from "react";

export interface DataType {
  key:React.Key;
  id:number;
  convenio_id:string;
  user_id:string;
  prefijo:string;
  consecutivo:string;
  resolucion:string;
  fecha_resolucion:string;
  desde:string;
  hasta:string;
  estado:string;
  created_at:string;
  updated_at: string;
  consecutivo_nc:string;
  consecutivo_nd:string;
}

export interface Pagination {
  data: FacturaVtaDis[];
  per_page: number;
  total: number;
}