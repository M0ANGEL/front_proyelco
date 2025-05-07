// subcategoriaAPI.ts
import { clientActivos } from "../client";
import {SubLocalizacionArea, ResponseSubLocalizacionArea, ResponseListSubLocalizacionArea} from "../types";




// Obtener lista de activos
export const getListaSubLocalizacionArea = async (
): Promise<ResponseListSubLocalizacionArea> => {
  const response = await clientActivos.get<{
    data: SubLocalizacionArea[];
    status: string;
    total: number;
    per_page: number;
  }>(`sub-localizacion-area`, {
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
export const getSubLocalizacionArea = async (id: number): Promise<ResponseSubLocalizacionArea> => {
  const response = await clientActivos.get<{
    data: SubLocalizacionArea;
    status: string;
  }>(`sub-localizacion-area/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
  };
};


// Crear un nuevo activo
export const crearSubLocalizacionArea = async (data: SubLocalizacionArea): Promise<any> => {
  return await clientActivos.post<any>("sub-localizacion-area", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Actualizar un activo existente
export const updateSubLocalizacionArea = async (id: number, data: SubLocalizacionArea): Promise<any> => {
  return await clientActivos.put<any>(`sub-localizacion-area/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Eliminar un activo
export const deleteSubLocalizacionArea = async (id: number): Promise<any> => {
  return await clientActivos.delete<any>(`sub-localizacion-area/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const actualizarEstadoArea = async (id:number, estado: string): Promise<any> => {
  return await clientActivos.put<any>(`actualizar-estado-area/${id}`,
    {
      estado : estado,
    },
    {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  };
