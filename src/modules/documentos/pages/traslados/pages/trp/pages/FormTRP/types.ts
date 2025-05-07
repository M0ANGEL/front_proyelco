export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  precio_promedio: string;
  cantidad: string;
  stock: string;
  valor: string;
  fvence: string;
  editable?: boolean;
}
