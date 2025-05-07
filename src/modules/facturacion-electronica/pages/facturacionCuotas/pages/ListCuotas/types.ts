import { DisCuota} from "@/services/types";


export interface DataType {
  key: React.Key;
  created_at: string;
  consecutivo: string;
  consecutivo_recaudo: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  nombre_completo: string;
  valor_cuota: string;
  num_contrato: string;
  descripcion: string;
  bod_nombre: string;
}


export interface Pagination {
  data: DisCuota[];
  per_page: number;
  total: number;
  page:number;
}

export interface Convenios {

  idConvenio:number;
  bodega: string;
}