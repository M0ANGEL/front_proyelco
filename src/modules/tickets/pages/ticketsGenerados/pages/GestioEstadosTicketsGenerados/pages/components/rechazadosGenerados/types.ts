//jsx
export interface ModalCerradosProps {
  ticket: DataType;
}

export interface DataType {
  key: number;
  id: number;
  created_at: string;
  cierre_ticket: string;
  prioridad: string;
  numero_ticket: string;
  autorizacion: string;
  detalle: string;
  respuesta_autorizacion: string;
  rechazo: string;
  usuario_solicita: string;
  usuario_soluciona: string;
  categoria: string;
  subcategoria: string;
  bodega: string;
  estado: string;
  nombre_proceso: string;
  documento: number;
  usuarioCrear: string;
}
