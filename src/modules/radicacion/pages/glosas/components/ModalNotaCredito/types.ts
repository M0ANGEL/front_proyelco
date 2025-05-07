import { InfoFactura } from "../../pages/FormGlosas/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  info_factura?: InfoFactura;
}
