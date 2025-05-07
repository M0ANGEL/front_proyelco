import { ProductoLote } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean, agregar?: string) => void;
  lotes: ProductoLote[];
}
