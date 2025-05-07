export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  dispensacion_id: number;
  consec_dis: string;
  producto_id: number;
  cod_barras: string;
  desc_producto: string;
  cantidad: number;
  cantidad_dev: number;
  cantidad_devolver: number;
  lote: string;
  f_vence: string;
  precio_venta: number;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  fuente: string;
  numero_servinte: string;
  codigo_servinte: string;
}

export interface SummaryProps {
  firstCell: CellProps;
  secondCell: CellProps;
  thirdCell: CellProps;
  fourthCell: CellProps;
}

interface CellProps {
  index: number;
  colSpan?: number;
  align?: AlignType;
}

declare type AlignType = "left" | "center" | "right";
