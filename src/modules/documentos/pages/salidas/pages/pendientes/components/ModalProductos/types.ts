import { Convenio } from "@/services/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSetDataSource: (data: DataType[]) => void;
  convenio?: Convenio;
  bodega_id: string;
}

export interface DataType {
  key: React.Key;
  id: any;
  precio_lista: number;
  descripcion: string;
  precio_promedio: number;
  cantidad: number;
  editable: boolean;
  iva: any;
  dias_tratamiento: number;
  stock: number;
  cod_padre: string;
}
