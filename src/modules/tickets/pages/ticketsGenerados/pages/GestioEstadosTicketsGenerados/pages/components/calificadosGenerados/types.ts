// Interfaces
export interface ModalCerradosProps {
  ticket: DataType;
  calificaciones: DataPregunta[];
}

//datos tipos
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
  calificacion_final: string;
  nombre_proceso: string;
  documento: number;
  usuarioCrear: string;
}

export interface DataPregunta {
  key: number;
  id: number;
  IdCa: number;
  pregunta: string;
  calificacion: string;
}
