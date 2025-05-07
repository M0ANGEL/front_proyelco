import { Localidades, Tercero, TerceroTipo } from "@/services/types";

export interface Props {
  tercero?: Tercero;
  tercerotipos?: TerceroTipo[];
  localidades?: Localidades[];
}
