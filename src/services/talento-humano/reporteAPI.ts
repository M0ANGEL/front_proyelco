
import { client } from "../client";

export interface AsistenciaTH {
  id: number;
  fecha_ingreso: string;
  hora_ingreso: string;
  fecha_salida: string;
  hora_salida: string;
  horas_laborales: string;
  nombre_completo: string;
  identificacion: string;
  tipo_documento: string;
  telefono_celular: string;
  nombre_obra: string;
  nombre_contratista: string;
  cargo: string;
  tipo_empleado_texto: string;
  tipo_obra_texto: string;
}


export interface ResponseAsistenciasTH {
  status: string;
  data: AsistenciaTH[];
  filtros?: {
    fecha_inicio: string;
    fecha_fin: string;
    total_registros: number;
  };
}

// Parámetros para el reporte
export interface FiltroReporteAsistencia {
  fecha_inicio: string;
  fecha_fin: string;
}

// Llamar reporte de asistencias con filtros - CORREGIDO
export const getReporteAsistenciasTH = async (filtros: FiltroReporteAsistencia): Promise<ResponseAsistenciasTH> => {
  return await client.post("reportesth-asistencia", filtros, {
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      'Content-Type': 'application/json'
    },
  });
};

// En tu reporteAPI.ts
// En tu reporteAPI.ts
// En tu reporteAPI.ts
export const exportReporteCompletoAsistenciasTH = async (filtros: FiltroReporteAsistencia) => {
  return await client.post(`export-reporte-completo-asistencias-th`, filtros, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
    responseType: "blob",
  });
};