// subcategoriaAPI.ts
import axios from "axios";
import { clientActivos } from "../client";
import { Categoria, Parametro, Parametros_SubCategoria, ResponseListParametros_SubCategoria, ResponseParametros_SubCategorias, SubCategoria} from "../types";

const API_BASE_URL = 'http://localhost/activosbackend/public/api';



// Obtener lista de parametros x categoria
export const getListaParametros_SubCategoria = async (
): Promise<ResponseListParametros_SubCategoria> => {
  const response = await clientActivos.get<{
    data: Parametros_SubCategoria[];
    status: string;
    total: number;
    per_page: number;
  }>(`parametro-sub-categoria`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


//obtener Parametros para mostrarlas en la pagina
export const getListaParametros = async (): Promise<{ data: Parametro[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/parametro`);
    return response.data;
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Error desconocido al obtener los parametros';
    throw new Error(message);
  }
};


//obtener SubCategorias para mostrarlas en la pagina
export const getListaSubCategorias = async (): Promise<{ data: SubCategoria[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sub-categoria`);
    return response.data;
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Error desconocido al obtener las sub-categorías';
    throw new Error(message);
  }
};

export const getListaCategorias = async (): Promise<{ data: Categoria[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sub-categoria`);
    return response.data;
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Error desconocido al obtener las categorías';
    throw new Error(message);
  }
};



// Obtener información de una parametros
export const getParametro_SubCategoria = async (id: number): Promise<ResponseParametros_SubCategorias> => {
  const response = await clientActivos.get<{
    data: Parametros_SubCategoria;
    status: string;
  }>(`parametro-sub-categoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
  };
};

// Crear una nueva parametros
export const crearParametro_SubCategoria = async (data: Parametros_SubCategoria): Promise<any> => {
  return await clientActivos.post<any>("parametro-sub-categoria", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Actualizar una parametros existente
export const updateParametro_SubCategoria = async (id: number, data: Parametros_SubCategoria): Promise<any> => {
  return await clientActivos.put<any>(`parametro-sub-categoria/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Eliminar una parametros
export const deleteParametro_SubCategoria = async (id: number): Promise<any> => {
  return await clientActivos.delete<any>(`parametro-sub-categoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const actualizarEstadoParametroSubCategoria = async (id:number, estado: string): Promise<any> => {
  return await clientActivos.put<any>(`actualizar-estado-parametroSubCategoria/${id}`,
    {
      estado : estado,
    },
    {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  };


  export const getListaParametrosSubCategoriasActivas = async (
    id_subCategoria: number
  ): Promise<ResponseListParametros_SubCategoria> => {
    const response = await clientActivos.get<{
      data: Parametros_SubCategoria[];
      status: string;
      total: number;
      per_page: number;
    }>(`parametros-subCategorias-activas/${id_subCategoria}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  
    // Asegurar que la respuesta coincide con ResponseListParametros_SubCategoria
    return {
      data: response.data.data,
      status: response.data.status,
      total: response.data.total,
      per_page: response.data.per_page,
    };
  };
  