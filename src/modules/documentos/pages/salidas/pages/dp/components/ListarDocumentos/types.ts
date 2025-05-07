import {
  DevolucionProveedorCabecera,
  Privilegios,
} from "@/services/types";

export interface Props {
  documentos?: DevolucionProveedorCabecera[];
  privilegios?: Privilegios;
  tab: string;
}

export interface DataType {
  key: React.Key;
  consecutivo: string;
  observacion: string;
  usuario: string;
  fecha: string;
  oc_id?: string;
  // detalleRQP: RqpDetalle[];
  // ordenes_compra: OrdenCompraCabecera[];
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
  data: DevolucionProveedorCabecera[];
  per_page: number;
  total: number;
}


export interface Props {
  privilegios?: Privilegios;
  tab: string;
  setLoader: (value: boolean) => void;
}