/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseConsultaDocumentos } from "../types";

export const getConsultaDocumentos = async (
  data: any
): Promise<ResponseConsultaDocumentos> => {
  return await client.post("reportes/otros-documentos", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
