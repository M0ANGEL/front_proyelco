/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  id: any;
  lote: string;
  key: React.Key;
  descripcion: string;
  precio_promedio: string;
  cantidad: string;
  stock: string;
  valor: string;
  fvence: string;
  editable?: boolean;
  codigo_servinte: string;
}

export interface RespondeCarguePlano {
  status: string;
  message: string;
  items: ProductosPlano[];
}

export interface ProductosPlano {
  codigo_producto: string;
  precio_promedio: string;
  descripcion: string;
  lote: string;
  fecha_vencimiento: string;
  cantidad: string;
  lote_id: string;
}
