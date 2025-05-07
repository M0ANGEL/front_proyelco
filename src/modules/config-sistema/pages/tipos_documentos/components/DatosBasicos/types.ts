import { Empresa, Grupo, TipoDocumento } from "@/services/types";

export interface Props {
  tipoDocumento?: TipoDocumento;
  empresas?: Empresa[];
  grupos?: Grupo[]
}
