/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDispensacion, Privilegios } from "@/services/types";

export interface Props {
  // documentos: IDispensacion[];
  privilegios?: Privilegios;
  tab: string;
}

export interface DataType {
  key: React.Key;
  num_docu: string;
  bodega: string;
  nompaciente: string;
  apepaciente: string;
  usuario: string;
  fecha: string;
  consecutivo: string;
  flag_pendientes: string;
  estado_auditoria: any;
  flag_devolucion: string;
  vlr_cuota: number;
  motivos_auditoria: string[];
  numero_servinte: string;
  fuente: string;
}
export interface DataTypeFile {
  key: React.Key;
  consecutivo: string;
  image: string;
}

export interface DataTypeDetalle {
  id_producto: string;
  descripcion_producto: string;
  cantidad: number;
  cantidadOC: number;
  key: React.Key;
  estado_cantidades: string;
}

export interface Pagination {
  data: IDispensacion[];
  per_page: number;
  total: number;
}
