/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseTkSubCategorias } from "../types";

//llamar todas las subcategorias
export const getTkUsuariosProcesoReporte = async (): Promise<ResponseTkSubCategorias> => {
  return await client.get("usuarios-proceso-reporte", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const generarReporteTickets = async (data: any): Promise<any> => {
  return await client.post("generar-reporte-ticket", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

