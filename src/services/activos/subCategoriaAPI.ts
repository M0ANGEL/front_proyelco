// subcategoriaAPI.ts

import axios from "axios";
import { clientActivos } from "../client";
import { SubCategoria, ResponseListSubCategorias, ResponseSubCategoria, ResponseSelectCategorias, Parametros_SubCategoria, ResponseSelectParametros_SubCategoria } from "../types";
import { Categoria } from '../types'; 

const API_BASE_URL = 'http://localhost/activosbackend/public/api';



// Obtener lista de subcategorías por categoría
export const getListaSubCategorias = async (
): Promise<ResponseListSubCategorias> => {
  const response = await clientActivos.get<{
    data: SubCategoria[];
    status: string;
    total: number;
    per_page: number;
  }>(`sub-categoria`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

//obtener categorias para mostrarlas en la pagina
export const getListaCategorias = async (): Promise<{ data: Categoria[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categoria`);
    return response.data;
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Error desconocido al obtener las categorías';
    throw new Error(message);
  }
};

//traer categorias x el id de subcategorias
export const getListaCategoriasxSubCategorias = async (id_subCategoria:number
): Promise<ResponseSelectCategorias> =>{
  return await clientActivos.get<{
    data: Categoria[];
    status: string;
  }>(`sub-categoria/categoria/${id_subCategoria}`,{
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
  });
};

//extraer parametros por subcategoria
export const getListaParametrosxSubCategorias = async (id_subCategoria:number
): Promise<ResponseSelectParametros_SubCategoria> =>{
  return await clientActivos.get<{
    data: Parametros_SubCategoria[];
    status: string;
  }>(`parametro-sub-categoria/sub-categoria/${id_subCategoria}`,{
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
  });
};



// Obtener información de una subcategoría
export const getSubCategoria = async (id: number):
 Promise<ResponseSubCategoria> => {
  return await clientActivos.get<{
    data: SubCategoria;
    status: string;
  }>(`sub-categoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Crear una nueva subcategoría
export const crearSubCategoria = async (data: SubCategoria): Promise<any> => {
  return await clientActivos.post<any>("sub-categoria", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Actualizar una subcategoría existente
export const updateSubCategoria = async (id: number, data: SubCategoria): Promise<any> => {
  return await clientActivos.put<any>(`sub-categoria/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Eliminar una subcategoría
export const deleteSubCategoria = async (id: number): Promise<any> => {
  return await clientActivos.delete<any>(`sub-categoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const actualizarEstadoSubCategoria = async (id:number, estado: string): Promise<any> => {
  return await clientActivos.put<any>(`actualizar-estado-subCategoria/${id}`,
    {
      estado : estado,
    },
    {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  };

export const getListaSubCategoriasActivas = async (
): Promise<ResponseListSubCategorias> => {
  const response = await clientActivos.get<{
    data: SubCategoria[];
    status: string;
    total: number;
    per_page: number;
  }>(`subCategorias-activas`, {
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
