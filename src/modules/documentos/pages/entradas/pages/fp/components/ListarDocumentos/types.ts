import {
  FacturaProveedorCabecera,
  OrdenCompraCabecera,
  Privilegios,
} from "@/services/types";

export interface Props {
  privilegios?: Privilegios;
  tab: string;
  setLoader: (value: boolean) => void;
}

export interface DataType {
  key: React.Key;
  consecutivo: string;
  consecutivo_oc?: string;
  observacion_rqp?: string;
  nro_factura?: string;
  observacion: string;
  usuario: string;
  fecha: string;
  oc_id?: string;
  proveedor: string;
  has_distribucion: boolean;
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
  data: OrdenCompraCabecera[] | FacturaProveedorCabecera[];
  per_page: number;
  total: number;
}
