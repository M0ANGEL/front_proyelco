// subcategoriaAPI.ts
import { clientActivos } from "../client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ResponseListAsignarActivos,
    AsignarActivos,
  } from "../types";
  


  // Obtener lista de activos
export const getListaAsignarActivos = async (
): Promise<ResponseListAsignarActivos> => {
  const response = await clientActivos.get<{
    data: AsignarActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(`asignar-activos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


//traer la lista de Asignar Activos x usuario x pendientes
export const getListaAsignarActivosEstadoUsuario = async (
  estado: string,
  id_usuario: number
): Promise<ResponseListAsignarActivos> => {
  const response = await clientActivos.get<{
    data: AsignarActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(`asignar-activos-estado-usuario`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: { 
      estado: estado.toString(),
      id_usuario : id_usuario.toString(),
    }, // Asegúrate de que 'estado' sea una cadena
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


export const getListaAsignarActivosAdministrador = async (
): Promise<ResponseListAsignarActivos> => {
  const response = await clientActivos.get<{
    data: AsignarActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(`asignar-activos-admin-pendientes`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


// Crear una asignacion de activo
export const crearAsignarActivo = async (data: AsignarActivos, user_id: number): Promise<any> => {
  return await clientActivos.post<any>("asignar-activos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      user_id : user_id.toString()
    }
  });
};

//aceptar una asignacion de activo
export const aceptarAsignacionActivo = async (
  id_asignacionActivo : number,
  userId: number,
  observacion: string,
): Promise<ResponseListAsignarActivos> =>{
  const response = await clientActivos.post<{
    data: AsignarActivos[];
    status: string;
    total: number;
    per_page: number; 
  }>(`asignar-activo-aceptar`,{ 
    id_asignacionActivo: id_asignacionActivo ,
    userId: userId,
    observacion: observacion,
  }, {
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return{
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  }
}

// // Actualizar una asignacion existente
// export const updateAsignacionActivo = async (id: number, data: AsignarActivos, id_user: number): Promise<any> => {
//   return await clientActivos.put<any>(`asignacion-activos/${id}`, data, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     params: {
//       id_user: id_user,
//     }
//   });
// };

// // Eliminar un activo
// export const deleteTrasladosActivos = async (id: number): Promise<any> => {
//   return await clientActivos.delete<any>(`traslados-activos/${id}`, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };
