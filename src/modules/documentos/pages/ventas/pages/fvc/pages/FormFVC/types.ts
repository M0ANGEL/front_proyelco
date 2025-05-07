import { Dayjs } from "dayjs";

export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  concepto: string;
  cantidad: number;
  iva: string;
  precio_venta: number;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  itemFromModal: boolean;
  editable: boolean;
  editableCant: boolean;
  editablePrecio: boolean;
  itemDev: boolean;
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

export interface FormProps {
  detalle: DataType[];
  tipo_documento_id: number;
  bodega_id: number;
  tercero_id: string;
  convenio_id: string;
  observacion: string;
  subtotal: number;
  iva: number;
  total: number;
  convenioRelacionado: number[];
  fechaDis: [start: Dayjs | null | undefined, end: Dayjs | null | undefined] | null;
  fechaInicio: string;
  fechaFin: string;
}
