import { Cabeceras, TipoDocumento } from "@/services/types";

export interface Props {
  tipoDocumento?: TipoDocumento;
  cabeceras: Cabeceras[];
}

export interface DataType {
  id: number;
  estado?: string;
  nombre_campo: string;
}
