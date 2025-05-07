export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSetDataSource: (data: DataType[]) => void;
  detalle: DataType[];
}

export interface DataType {
  key: number;
  descripcion: string;
  cod_padre: string;
  desc_padre: string;
  precio_promedio: number;
  cantidad: number;
  editable: boolean;
}
