/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseEmpleadosTH } from "../types";

//llamar todo los proveedores
export const getFichasObra= async (): Promise<ResponseEmpleadosTH> => {
  return await client.get("ficha-obra", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear ficha
export const crearFicha = async (data: any): Promise<any> => {
  return await client.post<any>("ficha-obra", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// //ver de la categoria por id
export const getFicha = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`ficha-obra/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateFicha = async (data: any, id: any): Promise<any> => {
  // Si es FormData, agregar _method para Laravel
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
  }
  
  return await client.post<any>(`ficha-obra/${id}`, data, {
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      // NO agregues 'Content-Type': 'multipart/form-data' - déjalo que el navegador lo haga automáticamente
    },
  });
};
//cambiar el estado de la categoria 
export const DeleteFicha = async ( id: any): Promise<any> => {
  return await client.delete<any>(`ficha-obra/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};