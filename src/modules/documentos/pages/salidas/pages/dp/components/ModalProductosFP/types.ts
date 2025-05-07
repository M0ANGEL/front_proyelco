export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  productosFP: DataType[];
  handleSelectProducto: (producto: DataType, loteKey: React.Key) => void;
  detalle: DataType[];
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  cod_padre: string;
  total_cantidad: number;
  precio_compra: number;
  iva: number;
  editablePrecio: boolean;
  lotes: DataTypeChildren[];
}

export interface DataTypeChildren {
  key: React.Key;
  lote: string;
  f_vencimiento: string;
  cantidad: number;
  editable: boolean;
}
