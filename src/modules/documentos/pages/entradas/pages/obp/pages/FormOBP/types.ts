export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  cod_padre: string;
  total_ingreso: number;
  precio: number;
  iva: number;
  precio_subtotal: number;
  precio_iva: number;
  precio_total: number;
  editablePrecio: boolean;
  itemFromModal: boolean;
  lotes: DataTypeChildren[];
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
