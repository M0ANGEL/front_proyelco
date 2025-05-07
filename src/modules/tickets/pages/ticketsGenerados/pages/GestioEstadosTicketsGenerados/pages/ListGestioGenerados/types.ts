export interface DataId {
  ticket: DataType;
  fetchList: () => void;
  pushNotification: (message: { title: string; type?: string }) => void;
}

export interface DataType {
  key: number;
  id: number;
  numero_ticket: string;
  categoria: string;
  subcategoria: string;
  detalle: string;
  userSoluciona: number | null;
  rechazo: string | null;
  estado: string ;
  prioridad: string;
  autorizacion: string;
  respuesta_autorizacion: string | null;
  documento: number
  created_at: string;
  usuarioAsignado: string | null;
  tiempo_gestion: string;
  observacion: string;
  categoria_id: string;
  subcategoria_id: string;
  listo: string;
  tiempo_restante: string;
  proceso_id: number | null;
}
