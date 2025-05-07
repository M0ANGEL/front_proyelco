import { Item } from "../ModalCarguePlano/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  facturas: Item[];
}
