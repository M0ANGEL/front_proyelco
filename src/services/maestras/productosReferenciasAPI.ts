/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { FormaFarma } from "../types";

export const getReferencias =
  async (): Promise<any> => {
    return await client.get<{ data: FormaFarma[]; status: string }>(
      "referencias",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };
 
  export const getUpr =
  async (): Promise<any> => {
    return await client.get<{ data: FormaFarma[]; status: string }>(
      "referencias-upr",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

  export const getTipoMedicamento =
  async (): Promise<any> => {
    return await client.get<{ data: FormaFarma[]; status: string }>(
      "referencias-tipoMedicamento",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };
