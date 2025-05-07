import { FacturaFVECabecera } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  factura?: FacturaFVECabecera;
  handleSelectProducts: (products: SelectedProduct[]) => void;
  detalle: React.Key[];
}

export interface DataType {
  key: React.Key;
  codigo_producto: string;
  descripcion: string;
  lote: string;
  fecha_vencimiento: string;
  cantidad_entregada: number;
  cantidad_devuelta: number;
  cantidad_devolver: number;
  editable: boolean;
  blockAmount: boolean;
}

export interface SelectedProduct {
  key: React.Key;
  cantidad: number;
}
