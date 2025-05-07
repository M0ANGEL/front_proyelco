export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  concepto: string;
  cantidad: number;
  cantidad_dev: number;
  valor_dev: number;
  cantidad_devolver: number;
  iva: number;
  precio_unitario: number;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  itemFromModal: boolean;
  editableConcepto: boolean;
  editableValor: boolean;
  editableCant: boolean;
  precio_maximo: number;
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
