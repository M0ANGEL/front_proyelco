// subcategoriaAPI.ts
import { clientActivos } from "../client";
import { ResponseListSolicitudActivos, ResponseSolicitudActivos, SolicitarActivos} from "../types";




// Obtener lista de solicitudes de activos
export const getListaSolicitudActivos = async (
): Promise<ResponseListSolicitudActivos> => {
  const response = await clientActivos.get<{
    data: SolicitarActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(`solicitar-activos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


// Obtener información de 1 solicitud de activos por id
export const getSolicitarActivo = async (id: number): Promise<ResponseSolicitudActivos> => {
  const response = await clientActivos.get<{
    data: SolicitarActivos;
    status: string;
  }>(`solicitar-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
  };
};


//traer solicitudes de activos pendientes por su estado y bodega
export const getListaSolicitarActivosPorBodegaYEstado = async (
  estado: string,
  bodega: number // Aquí pasas el ID de la bodega de origen
): Promise<ResponseListSolicitudActivos> => {
  const response = await clientActivos.get<{
    data: SolicitarActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(`solicitar-activos-pendientes`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      estado: estado.toString(), // Asegúrate de que 'estado' sea una cadena
      id_localizacion: bodega.toString(), // Asegúrate de que 'idBodegaOrigen' sea una cadena
    },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

//traer solicitudes de activos pendientes por su estado y bodega
export const getListaSolicitarActivosxUsuario = async (
  id_usuario: number
): Promise<ResponseListSolicitudActivos> => {
  const response = await clientActivos.get<{
    data: SolicitarActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(`solicitar-activos-usuario`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      id_usuario: id_usuario.toString(), 
    },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

//aceptar un traslado de activos
export const aceptarSolicitudActivos = async (
  id_SolicitudActivo : number
): Promise<ResponseListSolicitudActivos> =>{
  const response = await clientActivos.post<{
    data: SolicitarActivos[];
    status: string;
    total: number;
    per_page: number; 
  }>(`solicitar-activos-aceptar`,{ 
    id_SolicitudActivo: id_SolicitudActivo ,
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




// Crear un nuevo activo
export const crearSolicitarActivos = async (data: SolicitarActivos): Promise<any> => {
  return await clientActivos.post<any>("solicitar-activos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Actualizar un activo existente
export const updateSolicitarActivos = async (id: number, data: SolicitarActivos): Promise<any> => {
  return await clientActivos.put<any>(`solicitar-activos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Eliminar un activo
export const deleteSolicitarActivos= async (id: number): Promise<any> => {
  return await clientActivos.delete<any>(`solicitar-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
