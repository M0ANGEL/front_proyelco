import { ProductoLote,ListaPrecios } from "@/services/types";

export interface Props {
  listaPrecios?: ListaPrecios | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  onSetDataSource: (data: DataType[]) => void;
  dataResponse:any[];
}

export interface DataType {
  key: React.Key;
  id: number;
  descripcion: string;
  cantidad: number;
  precio_promedio: number;
  lote:string ;
  fvence: string;
  iva:number;
  precio_subtotal: number;
  precio_iva: number;
  precio_total: number;
  editable: boolean;
  editableLote: boolean;
  itemFromModal: boolean;
}

export interface SelectedProduct {
  key: React.Key;
  cantidad: number;
}

