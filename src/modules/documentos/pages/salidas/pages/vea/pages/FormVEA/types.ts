export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  id: number;
  descripcion: string;
  iva: number;
  precio_subtotal: number;
  precio_iva: number;
  precio_total: number;
  itemFromModal: boolean;
  cantidad: number;
  stock?:number;
  precio_promedio: number;
  lote: string;
  fvence: string;
  editable?: boolean;
  editableLote?: boolean;
  editableVen?: boolean;
}

export interface DataTypeChildren {
  key: React.Key;
  lote: string;
  f_vencimiento: string;
  cantidad: number;
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
