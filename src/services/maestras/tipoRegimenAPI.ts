/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseTipoRegimen } from "../types";

export const getTipoRegimen = async (): Promise<ResponseTipoRegimen> => {
  return await client.get("pacientes/tipo/regimen", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
