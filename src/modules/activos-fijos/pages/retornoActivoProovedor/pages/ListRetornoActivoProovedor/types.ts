import { Activos, UserData } from "@/services/types";

export interface retornoActivoProovedor{
    id: number;
    id_activo: number;
    descripcion: string;
    tipo_retorno: string;
    provedoras: string;
    fecha_creacion: Date;
    precio: number;
    estado: string;
    usuarios: UserData;
    activo: Activos;
}

export interface retornoActivoProovedorCerrado{
    id: number;
  id_activo: number;
  descripcion: string;
  tipo_retorno: string;
  provedoras: string;
  fecha_creacion: Date;
  precio: number;
  estado: string;  
  usuarios: UserData;
  activo: Activos;

}