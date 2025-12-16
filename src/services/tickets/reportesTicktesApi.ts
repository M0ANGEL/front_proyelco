/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";

export const generarReporteTickets = async (data: any): Promise<any> => {
  return await client.post("exportar-reporte-tickets", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
