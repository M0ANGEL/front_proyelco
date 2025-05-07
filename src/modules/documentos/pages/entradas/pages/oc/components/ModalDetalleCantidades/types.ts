import { OrdenCompraCabecera, RqpDetalle } from "@/services/types";

export interface Props {
  detalle: RqpDetalle[];
  ordenes: OrdenCompraCabecera[];
  estado_cantidades: string;
  RQPID?: React.Key;
  openDetalle: boolean;
  setOpenDetalle: (value: boolean) => void;
}

export interface DataType {
  id_producto: string;
  descripcion_producto: string;
  cantidad: number;
  cantidadOC: number;
  RQPID: React.Key;
  estado_cantidades: string;
}
