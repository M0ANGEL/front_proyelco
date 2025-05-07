export interface solicitarActivos {
  key: React.Key;
  nombre_solicitud: string;
  descripcion: string;
  id_usuario: number;
  id_localizacion: string;
  id_area: string;
  id_categoria: string;
  id_subCategoria: string;
  cantidad: string;
  estado: string;
  user_id: number;
}

export interface solicitarActivosCerrados{
    key: React.Key;
    nombre_solicitud: string;
    descripcion: string;
    id_usuario: string;
    id_localizacion: string;
    id_area: string;
    id_categoria: string;
    id_subCategoria: string;
    cantidad: string;
    estado: string;
    fecha_recibido: Date,
    user_id: number;

    
}