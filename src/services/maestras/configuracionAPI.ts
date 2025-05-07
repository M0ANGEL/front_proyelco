import { client } from "../client";
import { ResponseListaVariablesDinamicas, ResponseVariablesDinamicas, VariablesDinamicas } from "../types";

export const getListaVariablesGestionHumana = async (
): Promise<ResponseListaVariablesDinamicas> => {
  const response = await client.get<{
    data: VariablesDinamicas[];
    status: string;
    total: number;
    per_page: number;
  }>(`variables-gestion`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Asegurar que la respuesta coincide con ResponseListaCategorias
  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


export const getListaVariablesActivosFijos = async (
): Promise<ResponseListaVariablesDinamicas> => {
  const response = await client.get<{
    data: VariablesDinamicas[];
    status: string;
    total: number;
    per_page: number;
  }>(`variables-activos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Asegurar que la respuesta coincide con ResponseListaCategorias
  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

export const actualizarEstadoVariablesDinamicas = async (id:number, estado: string): Promise<any> => {
    return await client.put<any>(`actualizar-estado-variables/${id}`,
      {
        estado : estado,
      },
      {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    };

export const getListaVariablesActivas = async (
): Promise<ResponseListaVariablesDinamicas> => {
  const response = await client.get<{
    data: VariablesDinamicas[];
    status: string;
    total: number;
    per_page: number;
  }>(`variables-activas`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Asegurar que la respuesta coincide con ResponseListaCategorias
  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

export const getVariable = async (id: number): Promise<ResponseVariablesDinamicas> => {
    const response = await client.get<{
      data: VariablesDinamicas;
      status: string;
    }>(`variables/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  
    // Asegurar que la respuesta coincide con ResponseCategoria
    return {
      data: response.data.data,
      status: response.data.status,
    };
  };


  export const crearVariable = async (data: VariablesDinamicas): Promise<any> => {
    return await client.post<any>("variables", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };


  export const updateVariable = async (id: number, data: VariablesDinamicas): Promise<any> => {
    return await client.put<any>(`variables/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };
  
  
  
  
