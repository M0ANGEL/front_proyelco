import { ListaPrecios } from "@/services/types";

export interface Props {
  listaPrecios?: ListaPrecios | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  handleAddProducts: (selectedProducts: DataType[]) => void;
  detalle: DataType[];
  flagGravado: boolean;
}

export interface DataType {
  key: React.Key;
  producto_id: number;
  desc_producto: string;
  stock: number;
  cantidad: number;
  lote: string;
  fecha_vencimiento: string;
  precio_promedio: number;
  precio_venta: number;
  iva: number;
  editable: boolean;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  circular: string;
  precio_regulado: number;
  itemFromModal: boolean;
}
