import { client } from "../client";



//descargar de documento amarrado al ticket
export const ExportInformeExcelProyecto = async (id: any) => {
  return await client.get(`informe-proyecto-excel/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
    responseType: "blob", // Asegura que la respuesta sea tratada como un archivo binario
  });
};