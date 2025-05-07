import {  FacturaVtaDis } from "@/services/types";
import React from "react";

export interface DataType {
  key:React.Key;
  id:number;
  nombre:string;
  descripcion:string;
}

export interface Pagination {
  data: FacturaVtaDis[];
  per_page: number;
  total: number;
}