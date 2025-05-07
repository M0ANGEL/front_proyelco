/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseVacaciones, ResponseVacacion} from "../types";

export const getVacaciones = async (): Promise<ResponseVacaciones> => {
  return await client_gestion.get("vacaciones", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearVacaciones = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("vacaciones", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getVacacion = async (id: React.Key): Promise<ResponseVacacion> => {
  return await client_gestion.get<any>(`vacaciones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateVacacion = async (data: any, id: any): Promise<ResponseVacaciones> => {
  return await client_gestion.put<any>(`vacaciones/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getvacacionesCartas = async (id: any): Promise<any> => {
  return await client_gestion.get<any>("/vacaciones/cartas/" + id, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};