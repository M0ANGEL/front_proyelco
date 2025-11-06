/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseCondcutores, ResponsePlacas } from "../types";

//llamar toda las placas registradas
export const getPlacas= async (): Promise<ResponsePlacas> => {
  return await client.get("placas-carros", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todo los conductores
export const getConductores = async (): Promise<ResponseCondcutores> => {
  return await client.get("conductores", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getControlGasolina = async (data: any): Promise<any> => {
  return await client.post<any>("dataControlGasolina", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
