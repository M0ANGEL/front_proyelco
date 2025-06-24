export interface DataType {
  id: number;
  key: number;
  personl_id: string;
  proyecto_id: string;
  usuario_asigna: number;
  usuario_confirma: string;
  confirmacion: string;
  detalle: string;
  fecha_programacion: string;
  fecha_confirmacion: string;
  cargo: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  usurioConfirma: string;
  descripcion_proyecto: string;
  created_at: string;
  activo?: string;
  updated_at: string;
  created_at_string: string;
  }

  import {Asistencia } from "@/services/types";
  
  export interface Props {
    TkCategoria?: Asistencia;
  }
