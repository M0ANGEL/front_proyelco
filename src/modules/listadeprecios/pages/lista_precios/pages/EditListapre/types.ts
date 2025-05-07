export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  codigo: string;
  descripcion: string;
  precio: string;
  nit: string;
  editable?: boolean;
}
