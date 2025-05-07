/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
  documentId?: React.Key;
  updateDataSource: () => void;
  upModal: number;
  estadosBloqueados: number[];
}

export interface DataType {
  id: string;
  lote: any;
  fvence: any;
  precio_lista: string;
  key: React.Key;
  descripcion: string;
  precio_promedio?: number;
  cantidad: number;
  maxCantidad: number;
  precio_compra: number;
  precio_subtotal: string;
  iva: string;
  precio_total: string;
  editable: boolean;
  editablePrecio: boolean;
  autDet: boolean;
  motivo_produ: string;
  dias_tratamiento: string;
}
