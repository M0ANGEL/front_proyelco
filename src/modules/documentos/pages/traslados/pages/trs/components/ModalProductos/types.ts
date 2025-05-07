/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSetDataSource: (data: any[]) => void;
  hasFuente: boolean;
}

export interface DataType {
  id: any;
  valor: any;
  precio_lista: string;
  key: React.Key;
  descripcion: string;
  precio_promedio: number;
  fvence: any;
  cantidad: number;
  editable: boolean;
  stock: string;
  iva: any;
  cantSolicitada: number;
  codigo_servinte: string;
}
