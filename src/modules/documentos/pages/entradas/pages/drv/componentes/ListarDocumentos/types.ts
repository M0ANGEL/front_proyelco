import { DevolucionVentaDirectaCabecera, Privilegios } from "@/services/types";

export interface Props {
  // documentos: DevolucionDispensacionCabecera[];
  privilegios?: Privilegios;
  tab: string;
  setLoader: (value: boolean) => void;
}

export interface DataType {
  key: React.Key;
  consecutivo_remision: string;
  bodega: string;
  usuario: string;
  tercero: string;
  fecha: string;
  consecutivo: string;
  observacion: string;
  estado_facturacion: string;
  total: string;
}

export interface Pagination {
  data: DevolucionVentaDirectaCabecera[];
  per_page: number;
  total: number;
}
