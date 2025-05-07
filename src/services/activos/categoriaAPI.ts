/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientActivos } from "../client";
import { Categoria, ResponseListaCategorias, ResponseCategoria, SubCategoria, ResponseSelectSubCategorias, ResponseSelectCategorias, VariablesDinamicas, ResponseListaVariablesDinamicas } from "../types";

//Obtener lista de categorías
export const getListaCategorias = async (
): Promise<ResponseListaCategorias> => {
  const response = await clientActivos.get<{
    data: Categoria[];
    status: string;
    total: number;
    per_page: number;
  }>(`categoria`, {
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


//obtener subcategorias x categoria llamando a el back
export const getListaSubcategoriasxCategorias = async (id_categoria:number
): Promise<ResponseSelectSubCategorias> =>{
  return await clientActivos.get<{
    data: SubCategoria[];
    status: string;
  }>(`categoria/sub-categoria/${id_categoria}`,{
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
  });
};

//obtener categorias x sub-categoria llamando a el back
export const getListacategoriasxSubCategorias = async (id_subCategoria:number
): Promise<ResponseSelectCategorias> =>{
  return await clientActivos.get<{
    data: Categoria[];
    status: string;
  }>(`sub-categoria/categoria/${id_subCategoria}`,{
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
  });
};




// Obtener información de una categoría
export const getCategoria = async (id: number): Promise<ResponseCategoria> => {
  const response = await clientActivos.get<{
    data: Categoria;
    status: string;
  }>(`categoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Asegurar que la respuesta coincide con ResponseCategoria
  return {
    data: response.data.data,
    status: response.data.status,
  };
};

// Crear una nueva categoría
export const crearCategoria = async (data: Categoria): Promise<any> => {
  return await clientActivos.post<any>("categoria", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};



// Actualizar una categoría existente
export const updateCategoria = async (id: number, data: Categoria): Promise<any> => {
  return await clientActivos.put<any>(`categoria/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Eliminar una categoría
export const deleteCategoria = async (id: number): Promise<any> => {
  return await clientActivos.delete<any>(`categoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const actualizarEstadoCategoria = async (id:number, estado: string): Promise<any> => {
return await clientActivos.put<any>(`actualizar-estado-categoria/${id}`,
  {
    estado : estado,
  },
  {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }
);
};


export const getListaCategoriasActivas = async (
): Promise<ResponseListaCategorias> => {
  const response = await clientActivos.get<{
    data: Categoria[];
    status: string;
    total: number;
    per_page: number;
  }>(`categorias-activas`, {
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

export const getListaVariablesDinamicasVidaUtil = async (
): Promise<ResponseListaVariablesDinamicas> => {
  const response = await clientActivos.get<{
    data: VariablesDinamicas[];
    status: string;
    total: number;
    per_page: number;
  }>(`variables-dinamicas-vida-util`, {
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

