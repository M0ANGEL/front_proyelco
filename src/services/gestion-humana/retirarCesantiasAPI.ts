/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseRetirarCesantias } from "../types";

export const index = async (): Promise<ResponseRetirarCesantias> => {
  return await client_gestion.get("retirarcesantias", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// export const generarCartasLaborales = async (data: any): Promise<any> => {
//   return await client_gestion.post<any>("generarcartas", data, {
//     responseType: "arraybuffer",
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };

export const store = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("retirarcesantias", data, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const edit = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`retirarcesantias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const update = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`retirarcesantias/${id}`, data, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};