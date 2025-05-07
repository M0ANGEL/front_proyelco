import { IDispensacion } from "@/services/types";

export interface Props {
  handleSelectProducts: (products: SelectedProduct[]) => void;
  setOpen: (value: boolean) => void;
  dispensaciones: IDispensacion[];
  detalle: React.Key[];
  open: boolean;
  hasFuente: boolean;
}

export interface DataType {
  key: React.Key;
  cod_huv: string;
  consec_dis: string;
  cod_producto: string;
  desc_producto: string;
  cantidad: number;
  cantidad_dev: number;
  cantidad_devolver: number;
  lote: string;
  f_vence: string;
  fecha_creacion: string;
  editable: boolean;
  blockAmount: boolean;
  fuente: string;
  numero_servinte: string;
  bodega: string;
}

export interface SelectedProduct {
  key: React.Key;
  cantidad: number;
}
