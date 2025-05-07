import { Privilegios,DocumentosCabecera } from "@/services/types";

export interface Props {
    // documentos: DocumentosCabecera[];
    privilegios?: Privilegios;
    tab: string;
  }
  
  export interface DataType {
    key: React.Key;
    bodega: string;
    fecha: string;
    consecutivo: string;
    observacion: string;
    tipo_documento:string;
    motivos:string;
  }

  export interface Pagination {
    data: DocumentosCabecera[];
    per_page: number;
    total: number;
  }
  
