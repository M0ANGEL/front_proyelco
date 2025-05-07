export interface Props {
  open: boolean;
  setOpen: (value: boolean, fetch: boolean) => void;
  dispensacionId?: React.Key;
  consecutivo?: string;
}

export interface DataType {
  key: React.Key;
  codigo_producto: string;
  codigo_sebthi: string;
  descripcion: string;
  dias_tratamiento: number;
  cant_solicitada: number;
  cant_entregada: number;
  lote: string;
  fecha_vencimiento: string;
  precio_unitario: number;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  motivo_id: string;
}
