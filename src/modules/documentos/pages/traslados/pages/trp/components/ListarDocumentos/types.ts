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
  trs_id: string;
}

export interface Pagination {
  data: Traslados[];
  per_page: number;
  total: number;
}
