import { OrdenCompraCabecera, Privilegios } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  ordenes: OrdenCompraCabecera[];
  rqpInfo: {
    key: React.Key;
    bod_solicitante: string;
    usuario: string;
    fecha: string;
  } | null;
  privilegios?: Privilegios;
}

export interface DataType {
  key: number;
  tercero: string;
  bodega: string;
  observacion: string;
  subtotal: string;
  total: string;
  estado: string;
  consecutivo: string;
  rqp_id: string;
}
