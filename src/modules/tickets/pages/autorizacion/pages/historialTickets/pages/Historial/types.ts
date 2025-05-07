//tipos de datos
export interface DataId {
  dataTicket: DataType;
}

//datos tipos
export interface DataType {
  key: number;
  id: number;
  numero_ticket: string;
  autorizacion: string;
  detalle: string;
  created_at: string;
  estado: string;
  categoria: string;
  subcategoria: string;
  bodega: string;
  creador_ticket: string;
  fin_autorizacion: string;
  respuesta_autorizacion: string;
  nombre_proceso: string;
  documento: number;
}
