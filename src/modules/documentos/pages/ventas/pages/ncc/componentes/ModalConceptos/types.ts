import {  FacturaConceptoCabecera } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  factura?: FacturaConceptoCabecera;
  handleSelectProducts: (products: SelectedProduct[]) => void;
  detalle: string[];
}

export interface DataType {
  key: React.Key;
  concepto: string;
  cantidad: number;
  cantidad_dev: number;
  cantidad_devolver: number;
  editable: boolean;
  blockAmount: boolean;
}

export interface SelectedProduct {
  key: React.Key;
  cantidad: number;
}
