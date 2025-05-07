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
  total_ingreso: number;
  precio_compra: number;
  circular?: string;
  p_compra_regulado?: number;
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

export interface DataTypeModalPadre {
  key: React.Key;
  descripcion: string;
  laboratorio?: string;
  cod_padre: string;
  precio_promedio: number;
  precio_compra: number;
  iva: number;
}
