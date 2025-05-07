// subcategoriaAPI.ts
import { clientActivos } from "../client";
import { BajaActivosFijos, ResponseBajaActivosFijos,  ResponseListBajaActivosFijos} from "../types";




// Obtener lista de activos
export const getListaBajaActivosFijos = async (
): Promise<ResponseListBajaActivosFijos> => {
  const response = await clientActivos.get<{
    data: BajaActivosFijos[];
    status: string;
    total: number;
    per_page: number;
  }>(`baja-activos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


// Obtener información de los activos
export const getBajaActivosFijos = async (id: number): Promise<ResponseBajaActivosFijos> => {
  const response = await clientActivos.get<{
    data: BajaActivosFijos;
    status: string;
  }>(`baja-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
  };
};


// Crear un nuevo activo
export const crearBajaActivosFijos = async (data: FormData, id_usuario: number): Promise<any> => {
  return await clientActivos.post<any>("baja-activos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
        id_usuario: id_usuario.toString(), 
    },
  });
};

// Actualizar un activo existente
export const updateBajaActivosFijos = async (id: number, data: BajaActivosFijos, id_usuario: number): Promise<any> => {
  return await clientActivos.put<any>(`baja-activos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
        id_usuario: id_usuario.toString(),
    }
  });
};

// Eliminar un activo
export const deleteBajaActivosFijos = async (id: React.Key, id_usuario: number): Promise<any> => {
  return await clientActivos.delete<any>(`baja-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params:{
        id_usuario : id_usuario.toString(),
    }
  });
};


export const cancelarBajaActivosFijos = async (params:any): Promise<any> => {
  return await clientActivos.post<any>(`cancelar-baja-activos`,params,{
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },

  });
};



