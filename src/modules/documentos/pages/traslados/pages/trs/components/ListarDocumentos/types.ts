import { Privilegios, Traslados } from "@/services/types";

export interface Props {
  privilegios?: Privilegios;
  tab: string
}

export interface DataType {
  key: React.Key;
  bod_origen: string;
  bod_destino: string;
  user: string;
  fecha: string;
  user_acepta: string;
  user_anula: string;
  trs_id: string;
  numero_servinte: string;
}

export interface Pagination {
  data: Traslados[];
  per_page: number;
  total: number;
}

