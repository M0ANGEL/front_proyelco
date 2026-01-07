/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseEmpleadosTH, ResponseRfid } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todo los proveedores
export const getFichasObra= async (): Promise<ResponseEmpleadosTH> => {
  return await client.get("ficha-obra", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//crear ficha
export const crearFicha = async (data: any): Promise<any> => {
  return await client.post<any>("ficha-obra", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

// //ver de la categoria por id
export const getFicha = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`ficha-obra/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
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
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      // NO agregues 'Content-Type': 'multipart/form-data' - déjalo que el navegador lo haga automáticamente
    },
  });
};
//cambiar el estado de la categoria 
export const DeleteFicha = async ( id: any): Promise<any> => {
  return await client.delete<any>(`ficha-obra/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar todo los rfid disponibles
export const getRfidDisponibles = async (): Promise<ResponseRfid> => {
  return await client.get("rfid-disponibles", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//enviar datos para asignar rfid
export const UpdateRfidResponsable = async (data: any): Promise<any> => {
  return await client.post<any>("rfid-update", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const DeleteAsignacionRfid = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`rfid-delete/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};