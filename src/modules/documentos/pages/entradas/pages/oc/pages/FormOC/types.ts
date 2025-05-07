import { Producto } from "@/services/types";

export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  cod_padre: string;
  precio_promedio?: number;
  cantidad: number;
  maxCantidad: number;
  precio_compra: number;
  precio_subtotal: number;
  porc_descuento: number;
  total_descuento: number;
  iva: number;
  precio_total: number;
  p_regulado_compra: number;
  editable: boolean;
  editablePrecio: boolean;
  editableDescuento: boolean;
}

export interface DataTypeModalPadre {
  key: React.Key;
  descripcion: string;
  laboratorio?: string;
  cod_padre: string;
  precio_promedio: number;
  precio_compra: number;
  iva: number;
}

export interface DataTypeModalProductos {
  key: React.Key;
  descripcion: string;
  precio_promedio: number;
  cantidad: number;
  editable: boolean;
  producto: Producto;
}
