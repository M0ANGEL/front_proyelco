export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: number;
  descripcion: string;
  cod_padre: string;
  desc_padre: string;
  precio_promedio: number;
  cantidad: number;
  editable: boolean;
}
