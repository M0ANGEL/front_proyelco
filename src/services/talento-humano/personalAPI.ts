/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCargoTH, ResponseEmpleadosTH, ResponsePaisTH } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todo los proveedores
export const getPersonales = async (): Promise<ResponseEmpleadosTH> => {
  return await client.get("administar-th", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//crear el personal
export const crearPersonal = async (data: any): Promise<any> => {
  return await client.post<any>("administar-th", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//ver de la categoria por id
export const getPersonal = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administar-th/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar la categoria
export const updatePersonal = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`administar-th/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//paises
export const paisesTH = async (): Promise<ResponsePaisTH> => {
  return await client.get("paises-th", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//ciudaes
export const ciudadesTH = async ( id: any): Promise<any> => {
  return await client.get<any>(`ciudades-th/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//cargos th
export const cargosTH = async (): Promise<ResponseCargoTH> => {
  return await client.get("cargos-th", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//personal no proyelco

//llamar todo los proveedores
export const getPersonalesNo = async (): Promise<ResponseEmpleadosTH> => {
  return await client.get("personal-no-proyelco", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//crear el personal
export const crearPersonalNo = async (data: any): Promise<any> => {
  return await client.post<any>("personal-no-proyelco", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//ver de la categoria por id
export const getPersonalNo = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`personal-no-proyelco/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar la categoria
export const updatePersonalNo = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`personal-no-proyelco/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeletePersonalNo = async ( id: any): Promise<any> => {
  return await client.delete<any>(`personal-no-proyelco/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


export const getEmpleadoByCedula = async (cedula: string) => {
  return await client.get(`/empleados/${cedula}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//dar debaja personal

export const checkActivosPendientes = async (empleadoId: number) => {
  return await client.get(`/activos/verificar-pendientes/${empleadoId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

// services/talento-humano/personalAPI.js
export const DeletePersonal = async (id: React.Key, motivo?: string) => {
  return await client.post(`/personal/${id}/inactivar`, 
    { motivo },
    {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        'Content-Type': 'application/json'
      }
    }
  );
};


