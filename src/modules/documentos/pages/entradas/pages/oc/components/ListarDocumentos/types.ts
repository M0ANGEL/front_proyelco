import {
  OrdenCompraCabecera,
  Privilegios,
  Rqp,
  RqpDetalle,
} from "@/services/types";

export interface Props {
  selectedDoc: string | number;
  privilegios?: Privilegios;
  tab: string;
  setLoader: (value: boolean) => void;
}

export interface DataType {
  key: React.Key;
  bod_solicitante: string;
  usuario: string;
  fecha: string;
  estado_cantidades: string;
  detalleRQP: RqpDetalle[];
  ordenes_compra: OrdenCompraCabecera[];
  consecutivo: string;
  observacion: string;
}

export interface DataTypeOC {
  key: React.Key;
  consecutivo: string;
  consecutivo_oc?: string;
  consecutivo_rqp?: string;
  observacion: string;
  usuario: string;
  fecha: string;
  oc_id?: string;
  proveedor: string;
  bodega_destino: string;
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
  data: Rqp[] | OrdenCompraCabecera[];
  per_page: number;
  total: number;
}
