/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseTiposDocumentosIdentificacion,
  TiposDocumentosIdentificacion,
} from "../types";

export const getTiposDocumentosIdentificacion = async (
  maestra: string
): Promise<ResponseTiposDocumentosIdentificacion> => {
  return await client.get<{
    data: TiposDocumentosIdentificacion[];
    status: string;
  }>(`tiposDocumentosIdentificacion?maestra=${maestra}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
