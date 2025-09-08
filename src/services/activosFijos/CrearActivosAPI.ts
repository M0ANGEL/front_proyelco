/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseActivosS, ResponseUsers } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiActivos = async (): Promise<ResponseActivosS> => {
  return await client.get("administar-activos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear la categoria
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


//ver de la categoria por id
export const getActiActivo = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administar-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateActiActivo = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`administar-activos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteActiActivos = async ( id: any): Promise<any> => {
  return await client.delete<any>(`administar-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todos los usuarios
export const getActiUsers = async (): Promise<ResponseUsers> => {
  return await client.get("usuariosAsignacion", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiActivosDeBaja = async (): Promise<ResponseActivosS> => {
  return await client.get("administar-activosBaja", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
