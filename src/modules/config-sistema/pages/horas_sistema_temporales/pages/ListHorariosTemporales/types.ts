export interface DataType {
  id: number;
  key: number;
  observacion: string;
  fecha_inicio: string;
  fecha_final: string;
  usuarios_autorizados: string;
  estado: string;
}


import { HorariosAdicionales } from "@/services/types";

export interface Props {
  HorarioAdicional?: HorariosAdicionales;
}


export interface ResponseHorariosAdicionales {
  data: {
    status: string;
    data: HorariosAdicionales[];
  };
}

