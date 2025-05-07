/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_tk } from "../client";

export const generarReporteTickets = async (data: any): Promise<any> => {
  return await client_tk.post("exportar-reporte-tickets", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
