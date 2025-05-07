export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
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
