export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  addProducto: (value: string) => void;
  productos: string[];
}
