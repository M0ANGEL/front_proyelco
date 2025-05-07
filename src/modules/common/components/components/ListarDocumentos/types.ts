import { Privilegios, Traslados } from "@/services/types";

export interface Props {
  documentos: Traslados[];
  privilegios?: Privilegios;
  tab: string
}

export interface DataType {
  key: string;
  bod_origen: string;
  bod_destino: string;
  user: string;
  fecha: string;
  user_acepta: string;
  user_anula: string;

}
