/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DataType {
  id: number;
  created_at: string;
  consecutivo: string;
  total: string;
  nit: string;
  num_contrato: string;
  descripcion: string;
  bod_nombre: string;
  nombre_estado: string;
  estado_facturacion: string;
}

export interface TypesForm {
  numero_doc: string;
  convenio: string[];
  estado: string[];
  fechas: any;
  fechaInicio?: string;
  fechaFin?: string;
}
