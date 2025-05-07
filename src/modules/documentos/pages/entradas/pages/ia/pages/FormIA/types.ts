export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  producto_id: string;
  descripcion: string;
  cantidad: number;
  iva: number;
  lote: string;
  f_vencimiento: string;
  precio: number;
  precio_subtotal: number;
  precio_iva: number;
  precio_total: number;
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
