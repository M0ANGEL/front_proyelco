import React from "react";

export interface DataType {
    key: React.Key;
    id_activo : string;
    fecha_traslado: Date;
    bodega_origen_info: string;
    bodega_destino_info: string;
    user_origen_info: string;
    user_destino_info: string;
    estado : string;
    fecha_recibido: Date;
    descripcion: string;
}

export interface Props {
    tab: string
  }
