/* eslint-disable @typescript-eslint/no-explicit-any */
import { TipoDispensacion } from "@/services/types";

export interface Props {
  tipoDispensacion?: TipoDispensacion;
  campos: any[];
}

export interface DataType {
  id: number;
  obligatoriedad: string;
  nombre: string;
}
