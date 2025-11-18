/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCondcutores, ResponsePlacas } from "@/types/typesGlobal";
import { client } from "../client";

//llamar toda las placas registradas
export const getPlacas= async (): Promise<ResponsePlacas> => {
  return await client.get("placas-carros", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar todo los conductores
export const getConductores = async (): Promise<ResponseCondcutores> => {
  return await client.get("conductores", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const getControlGasolina = async (data: any): Promise<any> => {
  return await client.post<any>("dataControlGasolina", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};
