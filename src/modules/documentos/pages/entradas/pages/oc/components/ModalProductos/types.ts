import { Producto } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSelectProductos: (data: DataType[]) => void;
  detalle: DataTypeDetalle[];
}

export interface DataType {
  key: number;
  descripcion: string;
  precio_promedio: number;
  cantidad: number;
  editable: boolean;
  producto: Producto;
}

export interface DataTypeDetalle {
  key: React.Key;
  descripcion: string;
  cod_padre: string;
  precio_promedio?: number;
  cantidad: number;
  maxCantidad: number;
  precio_compra: number;
  precio_subtotal: number;
  iva: number;
  precio_total: number;
  editable: boolean;
  editablePrecio: boolean;
}
