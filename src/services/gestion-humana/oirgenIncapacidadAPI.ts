/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseOrigenIncapacidad } from "../types";

export const getOrigenIncapacidades = async (): Promise<ResponseOrigenIncapacidad> => {
  return await client_gestion.get("origenincapacidades", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};