export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  codigo_producto: string;
  descripcion: string;
  lote: string;
  fecha_vencimiento: string;
  cantidad_entregada: number;
  cantidad_devuelta: number;
  cantidad_devolver: number;
  iva: number;
  precio: number;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  itemFromModal: boolean;
  id_detalle: string;
  editable_cant: boolean;
  editable_valor: boolean;
  nota_id?: string;
}

export interface SummaryProps {
  firstCell: CellProps;
  secondCell: CellProps;
  thirdCell: CellProps;
}

interface CellProps {
  index: number;
  colSpan?: number;
  align?: AlignType;
}

declare type AlignType = "left" | "center" | "right";
