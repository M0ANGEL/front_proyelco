export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSetDataSource: (data: DataType[]) => void;
}

export interface DataType {
  key: number;
  descripcion: string;
  precio_promedio: number;
  cantidad: number;
  editable: boolean;
}
