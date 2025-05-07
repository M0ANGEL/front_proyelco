import { FacturaProveedorCabecera } from "@/services/types";

export interface Props {
  tab: string;
}

export interface DataType {
  key: React.Key;
  consecutivo: string;
  factura: string;
  proveedor: string;
  fecha: string;
}

export interface Pagination {
  data: FacturaProveedorCabecera[];
  per_page: number;
  total: number;
}