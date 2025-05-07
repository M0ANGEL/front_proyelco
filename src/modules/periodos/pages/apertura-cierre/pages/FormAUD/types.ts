import { Convenio } from "@/services/types";
export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  lote: any;
  fvence: any;
  precio_lista: number;
  key: React.Key;
  descripcion: string;
  precio_promedio?: number;
  cantidad: number;
  maxCantidad: number;
  precio_compra: number;
  precio_subtotal: number;
  iva: number;
  precio_total: number;
  editable: boolean;
  editablePrecio: boolean;
  autDet: boolean;
}

export interface Pagination {
  data: Convenio[];
  per_page: number;
  total: number;
}


export interface DataTypeDispensaciones {
  key: React.Key;
  consecutivo: string;
  fecha_dispensacion: string;
  desc_producto: string;
  cant_entregada: number;
  cant_saldo: number;
  cant_solicitada: number;
  bodega: string;
}
