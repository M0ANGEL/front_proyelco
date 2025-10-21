import { client } from "../client";
import { ResponsePapeleria } from "../types";

export const getPapeleria = async (): Promise<ResponsePapeleria> => {
  return await client.get("papeleria", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const DocPlantilla = async () => {
  return await client.get("plantilla-papelera-descarga", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    responseType: "blob",
  });
};

//envio cotizacion
export const enviarCotizacion = async (data: any): Promise<any> => {
  return await client.post<any>("envio-cotizacion", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const DocPlantillaMateriales = async () => {
  return await client.get("plantilla-papelera-descarga", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    responseType: "blob",
  });
};