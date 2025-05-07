export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  producto_id: number;
  desc_producto: string;
  cantidad: number;
  cantidad_dev: number;
  cantidad_devolver: number;
  lote: string;
  iva: number;
  f_vence: string;
  precio_unitario: number;
  precio_venta: number;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  itemFromModal: boolean;
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
