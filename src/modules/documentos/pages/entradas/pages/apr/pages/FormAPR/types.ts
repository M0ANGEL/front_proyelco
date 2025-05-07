import { Tercero } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSetDataSource: (data: DataType[]) => void;
}
export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  id: number;
  descripcion: string;
  cantidad: number;
  stock?:number;
  precio_promedio: number;
  lote: string;
  fvence: string;
  iva:number;
  precio_iva: number;
  precio_subtotal: number;
  precio_total: number;
  editable?: boolean;
  editableLote?: boolean;
  editableVen?: boolean;
  itemFromModal: boolean;
  // tercero:Tercero[];
}

export interface SelectedProduct {
  key: React.Key;
  cantidad: number;
}
