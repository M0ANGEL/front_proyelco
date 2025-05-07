
export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleAddProducts: (selectedProducts: DataType[]) => void;
  detalle: DataType[];
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
}
