export interface DataType {
  fecha: string;
  hora: string;
  consecutivo: string;
  cantidad_movimiento: number;
  cantidad_saldo: number;
  tipo_movimiento: string;
  lote: string;
  f_vence: string;
  bodega: string;
}

export interface FormTypes {
  bodega_id: string;
  bodegas: string[];
  fechas: undefined;
  producto_id: string;
  desc_producto: string;
  cod_padre: string;
  desc_cod_padre: string;
  tipo_busqueda: string;
}
