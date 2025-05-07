/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSetDataSource: (data: any[]) => void;
  listPrice: any;
  hasFuente: boolean;
}

export interface DataType {
  id: any;
  valor: any;
  precio_lista: number;
  key: React.Key;
  descripcion: string;
  precio_promedio: number;
  fvence: any;
  fecha_invima: string;
  cantidad: number;
  editable: boolean;
  stock: string;
  iva: any;
  estado_invima: string;
}
