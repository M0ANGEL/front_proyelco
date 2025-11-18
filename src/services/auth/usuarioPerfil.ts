/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";

export const cambiarContrasena = async (
  data: any,
  id: any
): Promise<any> => {
  return await client.put<any>(`/usuarios/${id}/contrasena`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};
