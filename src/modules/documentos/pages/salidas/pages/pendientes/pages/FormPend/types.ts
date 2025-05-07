import { Convenio, Producto } from "@/services/types";
export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  id: string;
  key: React.Key;
  descripcion: string;
  producto_id: string;
  cantidad: number;
  producto: Producto;
  cantidad_entregada: number;
  cantidad_pagada: number;
  cantidad_saldo: number;
  cod_padre: string;
  editablePrecio: boolean;
  editable: boolean;
  dias_tratamiento: number;
  estado: string
}

export interface DataTypePago {
  key: React.Key;
  autDet: string | null;
  id: string;
  desc_producto: string;
  cod_padre: string;
  lote: string;
  fecha_vencimiento: string;
  cantidad: number;
  cantSol: number;
  precio_lista: number;
  iva: number;
  precio_subtotal: number;
  precio_iva: number;
  precio_total: number;
  precio_promedio: number;
  dias_tratamiento: number;
}

export interface DataTypeProducto {
  id: number;
  key: React.Key;
  bod_nombre: string;
  cantidad_saldo: string;
  cantidad_pendiente: string;
  cant_pagar: string;
  cod_padre: string;
  descripcion: string;
  fecha_vencimiento: string;
  lote: string;
  precio: string;
  producto_id: string;
  stock: string;
  cantidad_pagada: string;
}

export interface Pagination {
  data: Convenio[];
  per_page: number;
  total: number;
}
