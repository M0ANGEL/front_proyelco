import { AlertaDistribucion } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  alertasDistribucion: AlertaDistribucion[];
}
export interface DataType {
  bod_nombre: string;
  items: Item[];
}

export interface Item {
  desc_producto: string;
  cantidad: number;
  producto_id: string;
}
