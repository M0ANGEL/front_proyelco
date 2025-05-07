import { OrdenCompraDetalle } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSelectProducto: (producto: OrdenCompraDetalle) => void;
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  producto: OrdenCompraDetalle;
}
