import {
  IDispensacion,
  OrdenCompraCabecera,
  Privilegios,
  Rqp,
  RqpDetalle,
} from "@/services/types";

export interface Props {
  documentos: IDispensacion[];
  privilegios?: Privilegios;
  tab: string;
}

export interface DataType {
  estado_auditoria: number;
  estado: any;
  flag_pendientes: number;
  estados: string;
  key: React.Key;
  bod_solicitante: string;
  usuario: string;
  fecha: string;
  estado_cantidades: string;
  detalleRQP: RqpDetalle[];
  ordenes_compra: OrdenCompraCabecera[];
  consecutivo: string;
}

export interface DataTypeDetalle {
  id_producto: string;
  descripcion_producto: string;
  cantidad: number;
  cantidadOC: number;
  key: React.Key;
  estado_cantidades: string;
}
