/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCaldiad } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getReportesNc = async (): Promise<ResponseCaldiad> => {
  return await client.get("reporte-material-nc", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

// //crear la categoria
// export const crearAmCliente = async (data: any): Promise<any> => {
//   return await client.post<any>("reporte-material-nc", data, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
//   });
// };

// //ver de la categoria por id
// export const getAmcliente = async (id: React.Key): Promise<any> => {
//   return await client.get<any>(`reporte-material-nc/${id}`, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
//   });
// };

// //actualizar la categoria
// export const updateAmCliente = async (data: any, id: any): Promise<any> => {
//   return await client.put<any>(`reporte-material-nc/${id}`, data, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
//   });
// };

// //cambiar el estado de la categoria 
// export const DeleteAmCliente = async ( id: any): Promise<any> => {
//   return await client.delete<any>(`reporte-material-nc/${id}`, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
//   });
// };