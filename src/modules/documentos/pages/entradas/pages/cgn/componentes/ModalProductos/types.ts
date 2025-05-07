export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSelectProducto: (producto: DataType) => void;
  detalle: DataType[];
  hasFuente: boolean;
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  cod_padre: string;
  total_ingreso: number;
  precio: number;
  iva: number;
  precio_subtotal: number;
  precio_iva: number;
  precio_total: number;
  editablePrecio: boolean;
  itemFromModal: boolean;
  lotes: DataTypeChildren[];
  cod_huv: string;
}

export interface DataTypeChildren {
  key: React.Key;
  lote: string;
  f_vencimiento: string;
  cantidad: number;
  itemFromModal: boolean;
}
