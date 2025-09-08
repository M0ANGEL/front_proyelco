import { client } from "../client";
import { ResponseActivosMantenimiento } from "../types";

//llamar todas los activos que esten en mantenimento
export const getActivosMantenimientos = async (): Promise<ResponseActivosMantenimiento> => {
  return await client.get("administra-mantenimiento-activos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todas los activos que esten en bodega
export const getActivosMantenimiento = async (): Promise<ResponseActivosMantenimiento> => {
  return await client.get("activosBodegaPrincipal", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//crear la categoria
export const crearActiMantenimiento = async (data: any): Promise<any> => {
  return await client.post<any>("administra-mantenimiento-activos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la categoria por id
export const getActiMantenimeinto = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administra-mantenimiento-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateActiMantenimiento = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`administra-mantenimiento-activos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//cambiar el estado de la categoria 
export const DeleteActiMantenemimiento = async ( id: any): Promise<any> => {
  return await client.delete<any>(`administra-mantenimiento-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
