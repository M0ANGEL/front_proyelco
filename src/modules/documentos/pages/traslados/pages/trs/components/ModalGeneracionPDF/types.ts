import { TrasladosGenerados } from "../FormDistribucionCompra/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  traslados: TrasladosGenerados[];
}
