/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";

export const actualizarSalariosMinimos = async (data: any): Promise<any> => {
  return await client_gestion.post("salariosminimos", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
};