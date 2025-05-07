import { FacturaVtaDis} from "@/services/types";

export interface DataType {
  key: React.Key;
  codigo: string;
  nombre_estado: string;//EstadosAuditoria[]
  nit: string;
  created_at:string,
  num_contrato: string,
  consecutivo: string;
  bodega: string;
  total:string;
  observacion: string;
  tercero:string;
}


export interface Pagination {
  data: FacturaVtaDis[];
  per_page: number;
  total: number;
  page:number;
}

export interface Convenios {

  idConvenio:number;
  bodega: string;
}