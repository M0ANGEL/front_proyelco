import { DataType } from "../../pages/FormSCO/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  hasFuente: boolean;
  addProducts: (productos: DataTypeProductos[]) => void;
  detalle: DataType[];
}

export interface DataTypeProductos {
  key: React.Key;
  id: number;
  producto_id: string;
  descripcion: string;
  cantidad: number;
  precio_promedio: number;
  lote: string;
  fvence: string;
  editable: boolean;
  codigo_servinte: string;
  stock: number;
  iva: number;
}
