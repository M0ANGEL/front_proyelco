import { DocumentosSync, FacturaFVEDetalle } from "@/services/types";
import { Dayjs } from "dayjs";

export interface DataType {
  bodega_id: string;
  bodega: string;
  consecutivo: string;
  created_at: string;
  descripcion: string;
  docu_entrada: string;
  docu_prestamo: string;
  docu_salida: string;
  docu_vinculado_id: string;
  estado: string;
  fecha_cierre_contable: string;
  id: number;
  impuesto: string;
  motivo_id: string;
  observacion: string;
  subtotal: string;
  tercero_id: string;
  tipo_documento_id: string;
  total: string;
  updated_at: string;
  user_id: string;
  codigo_homologacion: string;
  sync: string;
  bod_nombre: string;
  nit: string;
  razon_soc: string;
  numero_fve?: string;
  nro_factura?: string;
  factura_nro?: string;
  ipoconsumo?: string;
  numero_nota_credito?: string;
  numero_factura_vta?: string;
  codigo?: string;
  numero_nota_debito?: string;
  nombre_estado?: string;
  estado_id?: string;
  status_code?: string;
  convenio_id?: string;
  convenio?: string;  
}

export interface Pagination {
  data: DocumentosSync[];
  per_page: number;
  total: number;
  page:number;
}

export interface ResponseEmpresa {
  data: {
    status: string;
    data: Empresa[];
  };
}
export interface Empresa {
  id: number;
  emp_nombre: string;
  estado: string;
  nit: string;
  direccion: string;
  telefono: string;
  servidor_smtp: string;
  protocolo_smtp: string;
  cuenta_de_correo: string;
  contrasena_correo: string;
  created_at: Date;
  updated_at: Date;
}

export interface FormTypes {
  fechas: [start: Dayjs | null | undefined, end: Dayjs | null | undefined];
  grupo: any[];
  tipo_documento: string[];
  estado: string;
  fechaInicio: string;
  fechaFin:string;
}


