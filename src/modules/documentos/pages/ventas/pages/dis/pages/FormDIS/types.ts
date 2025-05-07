/* eslint-disable @typescript-eslint/no-explicit-any */
import { Convenio } from "@/services/types";

export interface DataType {
  id: any;
  lote: any;
  fvence: any;
  precio_lista: number;
  precio?: number;
  key: React.Key;
  descripcion: string;
  cod_mipres?: string;
  precio_promedio?: number;
  cantidad: number;
  maxCantidad?: number;
  precio_compra?: number;
  precio_subtotal: number;
  iva: number;
  precio_total: number;
  editable: boolean;
  editablePrecio?: boolean;
  autDet?: any;
  stock?: any;
  cantSol: any;
  dias_tratamiento: number;
  codigo_servinte: string;
}

export interface Pagination {
  data: Convenio[];
  per_page: number;
  total: number;
}

export interface DataTypeDispensaciones {
  key: React.Key;
  consecutivo: string;
  observaciones: string;
  fecha_dispensacion: string;
  desc_producto: string;
  cant_entregada: number;
  cant_saldo: number;
  cant_solicitada: number;
  bodega: string;
}

export interface DataTypePendientes {
  key: React.Key;
  consecutivo: string;
  observaciones: string;
  dispensacion: string;
  fecha_pendiente: string;
  desc_producto: string;
  cant_entregada: number;
  cant_saldo: number;
  cant_solicitada: number;
  bodega: string;
}
