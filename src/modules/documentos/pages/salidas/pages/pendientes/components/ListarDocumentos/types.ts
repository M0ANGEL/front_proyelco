import { IDPendiente, Privilegios } from "@/services/types";

export interface Props {
  privilegios?: Privilegios;
  tab: string;
}

export interface DataType {
  key: React.Key;
  consecutivo: string;
  consecutivo_dispensacion: string;
  dispensacion_id: number;
  num_docu: string;
  nombres: string;
  apellidos: string;
  bodega: string;
  usuario: string;
  fecha: string;
  flagPago: boolean;
  flagPagos: boolean;
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
  data: IDPendiente[];
  per_page: number;
  total: number;
}
