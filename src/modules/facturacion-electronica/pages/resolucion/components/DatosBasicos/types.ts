import { Empresa, Resolucion } from "@/services/types";

export interface Props {
  resolucion?: Resolucion;
  empresas?: Empresa[];
  desde?:"";
  hasta?:"";
}
