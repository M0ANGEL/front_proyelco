export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  concepto: string;
  cantidad: number;
  iva: number;
  precio_unitario: number;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  itemFromModal: boolean;
  editableConcepto: boolean;
  editableCantidad: boolean;
  editablePrecio: boolean;
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
