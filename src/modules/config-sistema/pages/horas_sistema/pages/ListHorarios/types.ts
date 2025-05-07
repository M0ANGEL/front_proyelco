export interface DataType {
  key: number;
  nombre_perfil: string;
  user_id: string;
  estado: string;
}


import { PerfilesHorarios } from "@/services/types";

export interface Props {
  HRperfil?: PerfilesHorarios;
}

