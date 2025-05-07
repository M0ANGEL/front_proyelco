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
  cod_padre: string;
  total_cantidad: number;
  total_ingreso: number;
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

export interface ProductoInfo {
  codigo: string;
  descripcion: string;
  cant_pedida: number;
  cant_ingresada: number;
}

export interface LoteForm {
  lote: string;
  fecha_vencimiento: Date;
  cantidad: number;
}
