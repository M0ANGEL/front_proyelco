/* eslint-disable @typescript-eslint/no-explicit-any */
import { FacturaRadicada } from "@/services/types";
import { Dayjs } from "dayjs";

export interface Pagination {
  data: FacturaRadicada[];
  per_page: number;
  total: number;
}

export interface FormTypes {
  radicados: string[];
  facturas: string[];
  estados: string[];
  fechas: [start: Dayjs | null | undefined, end: Dayjs | null | undefined];
  fechas_string: string[];
  searchInput: string;
  no_glosado?: boolean;
  radicados_id?: any;
}

export interface InfoFactura {
  convenio_id: string;
  numero_factura: string;
  cliente: string;
}
