export interface Props {
  data: DataTypeChildren[];
  setChildren: (children: DataTypeChildren[]) => void;
  setCantidadLote: (
    cantidad: number,
    key: React.Key,
    loteKey: React.Key
  ) => void;
  accion: string;
}

export interface DataTypeChildren {
  key: React.Key;
  lote: string;
  f_vencimiento: string;
  cantidad: number;
  editable: boolean;
}
