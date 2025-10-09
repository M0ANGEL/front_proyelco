// // // import { client } from "../client";
// // // import { ResponseEmpleadosTH } from "../types";

// // // //llamar reprote
// // // export const getReporteAsistenciasTH = async (): Promise<ResponseEmpleadosTH> => {
// // //   return await client.get("reportesth-asistencia", {
// // //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// // //   });
// // // };
// // import { client } from "../client";

// // export interface AsistenciaTH {
// //   id: number;
// //   fecha_ingreso: string;
// //   hora_ingreso: string;
// //   fecha_salida: string;
// //   hora_salida: string;
// //   horas_laborales: string;
// //   nombre_completo: string;
// //   identificacion: string;
// //   tipo_documento: string;
// //   telefono_celular: string;
// //   nombre_obra: string;
// //   nombre_contratista: string;
// //   cargo: string;
// //   tipo_empleado_texto: string;
// //   tipo_obra_texto: string;
// // }

// // export interface ResponseAsistenciasTH {
// //   status: string;
// //   data: AsistenciaTH[];
// // }

// // // Llamar reporte de asistencias
// // export const getReporteAsistenciasTH = async (): Promise<ResponseAsistenciasTH> => {
// //   return await client.get("reportesth-asistencia", {
// //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// //   });
// // };
// import { client } from "../client";

// export interface AsistenciaTH {
//   id: number;
//   fecha_ingreso: string;
//   hora_ingreso: string;
//   fecha_salida: string;
//   hora_salida: string;
//   horas_laborales: string;
//   nombre_completo: string;
//   identificacion: string;
//   tipo_documento: string;
//   telefono_celular: string;
//   nombre_obra: string;
//   nombre_contratista: string;
//   cargo: string;
//   tipo_empleado_texto: string;
//   tipo_obra_texto: string;
// }

// export interface ResponseAsistenciasTH {
//   status: string;
//   data: AsistenciaTH[];
//   filtros?: {
//     fecha_inicio: string;
//     fecha_fin: string;
//     total_registros: number;
//   };
// }

// // Parámetros para el reporte
// export interface FiltroReporteAsistencia {
//   fecha_inicio: string;
//   fecha_fin: string;
// }

// // Llamar reporte de asistencias con filtros
// export const getReporteAsistenciasTH = async (filtros: FiltroReporteAsistencia): Promise<ResponseAsistenciasTH> => {
//   return await client.post("reportesth-asistencia", {
//     params: filtros,
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };
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
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json'
    },
  });
};