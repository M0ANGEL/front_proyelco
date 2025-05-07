export interface Props {
  data: DataTypeChildren[];
  setChildren: (children: DataTypeChildren[]) => void;
  accion: string;
  cgn_id?: string;
}

export interface DataTypeChildren {
  key: React.Key;
  lote: string;
  f_vencimiento: string;
  cantidad: number;
  itemFromModal: boolean;
}
