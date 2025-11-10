// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { client } from "../client";
// import { ResponseActivosS, ResponseUsers } from "../types";

// //llamar todas los clientes usaremos Am = para identificar que es de adminisracion
// export const getActiActivos = async (): Promise<ResponseActivosS> => {
//   return await client.get("administar-activos", {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };

// //crear la categoria
// export const crearActiActivo = async (data: any): Promise<any> => {
//   const formData = new FormData();

//   // Agregamos todos los campos de data al FormData
//   for (const key in data) {
//     formData.append(key, data[key]);
//   }

//   return await client.post<any>("administar-activos", formData, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };


// //ver de la categoria por id
// export const getActiActivo = async (id: React.Key): Promise<any> => {
//   return await client.get<any>(`administar-activos/${id}`, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };

// //actualizar la categoria
// export const updateActiActivo = async (data: any, id: any): Promise<any> => {
//   return await client.put<any>(`administar-activos/${id}`, data, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };

// //cambiar el estado de la categoria 
// export const DeleteActiActivos = async ( id: any): Promise<any> => {
//   return await client.delete<any>(`administar-activos/${id}`, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };

// //llamar todos los usuarios
// export const getActiUsers = async (): Promise<ResponseUsers> => {
//   return await client.get("usuariosAsignacion", {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };


// //llamar todas los clientes usaremos Am = para identificar que es de adminisracion
// export const getActiActivosDeBaja = async (): Promise<ResponseActivosS> => {
//   return await client.get("administar-activosBaja", {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseUsers } from "../types";

// Interfaces para paginación
export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
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

// ✅ OBTENER ACTIVOS CON PAGINACIÓN Y BÚSQUEDA
export const getActiActivos = async (params: PaginationParams = {}): Promise<{ data: PaginatedResponse<any> }> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.search) queryParams.append('search', params.search);
  
  const queryString = queryParams.toString();
  const url = queryString ? `administar-activos?${queryString}` : 'administar-activos';
  
  return await client.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// ✅ OBTENER ACTIVOS DE BAJA CON PAGINACIÓN
export const getActiActivosDeBaja = async (params: PaginationParams = {}): Promise<{ data: PaginatedResponse<any> }> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.search) queryParams.append('search', params.search);
  
  const queryString = queryParams.toString();
  const url = queryString ? `administar-activosBaja?${queryString}` : 'administar-activosBaja';
  
  return await client.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// ✅ OBTENER USUARIOS CON PAGINACIÓN (por si acaso)
export const getActiUsers = async (params: PaginationParams = {}): Promise<ResponseUsers> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.search) queryParams.append('search', params.search);
  
  const queryString = queryParams.toString();
  const url = queryString ? `usuariosAsignacion?${queryString}` : 'usuariosAsignacion';
  
  return await client.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//ver del activo por id
export const getActiActivo = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administar-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar el activo
export const updateActiActivo = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`administar-activos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado del activo (dar de baja)
export const DeleteActiActivos = async (id: any): Promise<any> => {
  return await client.delete<any>(`administar-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};