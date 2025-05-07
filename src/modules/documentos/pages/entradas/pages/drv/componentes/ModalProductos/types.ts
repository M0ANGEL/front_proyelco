import {  RemisionVentaDirectaCabecera } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  remision?: RemisionVentaDirectaCabecera;
  handleSelectProducts: (products: SelectedProduct[]) => void;
  detalle: React.Key[];
}

export interface DataType {
  key: React.Key;
  cod_producto: string;
  desc_producto: string;
  cantidad: number;
  cantidad_dev: number;
  cantidad_devolver: number;
  lote: string;
  f_vence: string;
  editable: boolean;
  blockAmount: boolean;
}

export interface SelectedProduct {
  key: React.Key;
  cantidad: number;
}
