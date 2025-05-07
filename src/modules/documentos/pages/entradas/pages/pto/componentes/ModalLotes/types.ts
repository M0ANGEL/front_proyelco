export interface Props {
  openModalLote: boolean;
  setOpenModalLote: (value: boolean) => void;
  producto_id: React.Key | undefined;
  detalle: DataType[];
  setDetalle: (value: DataType[]) => void;
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  cod_huv: string;
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
}

export interface DataTypeChildren {
  key: React.Key;
  lote: string;
  f_vencimiento: string;
  cantidad: number;
  itemFromModal: boolean;
}

export interface ProductoInfo {
  codigo: string;
  descripcion: string;
  cant_ingresada: number;
}

export interface LoteForm {
  lote: string;
  fecha_vencimiento: Date;
  cantidad: number;
}
