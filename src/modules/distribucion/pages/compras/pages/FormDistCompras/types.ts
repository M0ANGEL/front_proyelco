import { AlertasPlano, ErroresPlano } from "@/services/types";

export interface FormTypes {
  nombre: string;
  descripcion: string;
  bodegas: number[];
  detalle: DataType[];
}

export interface DataType {
  key: React.Key;
  producto_id: string;
  descripcion: string;
  rqp_id: string;
  rqp_consec: string;
  cantidad_max: number;
  total_cantidad_distribucion: number;
  total_cantidad_trasladada: number;
  bodegas: DistBodega[];
}

export interface DistBodega {
  key: React.Key;
  bodega_id: number;
  bodega_nombre: string;
  cantidad_distribucion: number;
  cantidad_trasladada: number;
  has_alerta: number;
}

export interface ResponsePlanoDistCompras {
  status: string;
  message: string;
  errores: ErroresPlano[];
  alertas: AlertasPlano[];
  items: DataType[];
  bodegas_select: number[];
}
