import { Bodega, Empresa, Localidades } from "@/services/types";

export interface Props {
  bodega?: Bodega;
  empresas?: Empresa[];
  localidades?:Localidades[];
}
