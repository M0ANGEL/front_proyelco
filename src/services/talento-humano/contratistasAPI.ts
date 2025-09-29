/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseContratistasSST } from "../types";

//llamar todo los proveedores
export const getContratistas = async (): Promise<ResponseContratistasSST> => {
  return await client.get("contratistas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

