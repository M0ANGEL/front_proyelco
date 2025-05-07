/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_tk } from "../client";
import { ResponseTkSubCategorias } from "../types";

//llamar todas las subcategorias
export const getTkUsuariosProcesoReporte = async (): Promise<ResponseTkSubCategorias> => {
  return await client_tk.get("usuarios-proceso-reporte", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const generarReporteTickets = async (data: any): Promise<any> => {
  return await client_tk.post("generar-reporte-ticket", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

