export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  oldItem?: OldItem;
  handleSelectProductoPadre: (producto: DataType) => void;
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  laboratorio: string;
  cod_padre: string;
  precio_promedio: number;
  precio_compra: number;
  iva: number;
}

export interface OldItem {
  key: React.Key;
  cod_padre: string;
}
