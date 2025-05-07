import { Paciente } from "@/services/types";

export interface DataType {
    key: number;
    tipo_identificacion: string; 
    numero_identificacion: string;
    nombre_primero: string;
    nombre_segundo: string;
    apellido_primero: string;
    apellido_segundo: string;
    fecha_nacimiento: string;
    edad: string;
    genero: string;
    direccion: string;
    celular: string;
    eps: string;
    estado: string;
  }

  export interface Pagination {
    data: Paciente[];
    per_page: number;
    total: number;
  }