export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  cantidad: number;
  precio_promedio: number;
  precio_subtotal: number;
  precio_total: number;
  precio_iva: number;
  iva: number;
  producto_id: string;
  lote: string;
  fvence: string;
  lote_id: string;
}
