export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  producto_id: number;
  desc_producto: string;
  stock: number;
  cantidad: number;
  lote: string;
  fecha_vencimiento: string;
  precio_promedio: number;
  precio_venta: number;
  iva: number;
  editable: boolean;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  circular: string;
  precio_regulado: number;
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
