

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseUsers } from "@/types/typesGlobal";
import { client } from "../client";

// Interfaces para paginación
export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
  responsable?: string; // ✅ NUEVO PARÁMETRO
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

// ✅ OBTENER ACTIVOS CON PAGINACIÓN, BÚSQUEDA Y RESPONSABLE
export const getActiActivos = async (params: PaginationParams = {}): Promise<{ data: PaginatedResponse<any> }> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.responsable) queryParams.append('responsable', params.responsable); // ✅ NUEVO
  
  const queryString = queryParams.toString();
  const url = queryString ? `administar-activos?${queryString}` : 'administar-activos';
  
  return await client.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

// ✅ OBTENER ACTIVOS DE BAJA CON PAGINACIÓN Y RESPONSABLE
export const getActiActivosDeBaja = async (params: PaginationParams = {}): Promise<{ data: PaginatedResponse<any> }> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.responsable) queryParams.append('responsable', params.responsable); // ✅ NUEVO
  
  const queryString = queryParams.toString();
  const url = queryString ? `administar-activosBaja?${queryString}` : 'administar-activosBaja';
  
  return await client.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

// ✅ OBTENER USUARIOS CON PAGINACIÓN (se mantiene igual)
export const getActiUsers = async (params: PaginationParams = {}): Promise<ResponseUsers> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.search) queryParams.append('search', params.search);
  
  const queryString = queryParams.toString();
  const url = queryString ? `usuariosAsignacion?${queryString}` : 'usuariosAsignacion';
  
  return await client.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

// 🔧 LAS SIGUIENTES APIS PERMANECEN IGUAL (no necesitan paginación)

//crear el activo
export const crearActiActivo = async (data: any): Promise<any> => {
  const formData = new FormData();

  // Agregamos todos los campos de data al FormData
  for (const key in data) {
    formData.append(key, data[key]);
  }

  return await client.post<any>("administar-activos", formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//ver del activo por id
export const getActiActivo = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administar-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar el activo
// export const updateActiActivo = async (data: any, id: any): Promise<any> => {
//   return await client.put<any>(`administar-activos/${id}`, data, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
//   });
// };

export const updateActiActivo = async (data: any, id: any): Promise<any> => {
  const formData = new FormData();

  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  }

  return await client.post<any>(
    `administar-activos/${id}?_method=PUT`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


//cambiar el estado del activo (dar de baja)
export const DeleteActiActivos = async (id: any): Promise<any> => {
  return await client.delete<any>(`administar-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//poner bodega responsable al activo
export const UpdateBodegaResponsable = async (data: any): Promise<any> => {
  return await client.post<any>("bodega-responsable-activo", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const DeleteBodegaResponsable = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`bodega-responsable-activo-delete/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


