/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
// import { ResponseContratoTerminado } from "../types";

export const generarContratos = async (id: any): Promise<any> => {
  return await client_gestion.get<any>("generarcontratos/" + id, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const generarCartasLaborales = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("generarcartas", data, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const generarLicenciasLaborales = async (id: any): Promise<any> => {
  return await client_gestion.get<any>("generarlicencias/" + id, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// export const generarCartaAceptacion = async (id: any): Promise<any> => {
//   return await client_gestion.get<any>("generararCartaAceptacion/" + id, {
//     responseType: "arraybuffer",
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };