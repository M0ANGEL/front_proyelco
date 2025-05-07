import { Bodega, Producto, ProductoLote, Vencimientos } from "@/services/types";
import React from "react";

export interface DataType {
  key: React.Key;
  id: string;
  cod_padre: string;
  padre_descripcion: string;
  producto_descripcion: string;
  productos: Producto[];
  productos_lotes?: DataTypeChildren[];
  bod_nombre: string;
  // lotes?: DataTypeChildren[];
  bodega_id: string;
  producto_id: string;
  Bodega_con_pendientes: string;
  Bodegas_con_dispensaciones: string;
  DiferenciaEnMeses: string;
}

export interface DataTypeChildren {
  // id: number;
  // lote: string;
  // fecha_vencimiento: string;
  // stock: string;
  lote: string;
  iva: number;
  precio_lista: number;
  descripcion: string;
  precio_promedio: string;
  fecha_vencimiento: string;

}

export interface Pagination {

  data: Vencimientos[];
  per_page: number;
  total: number;
  page?: number;
  // size?: number;

}

