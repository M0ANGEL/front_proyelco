import { ResponseObrasPermisosAsistencia } from "@/types/typesGlobal";
import { client } from "../client";


export const darPermisosObrasAsistencia = async (data: any): Promise<any> => {
  return await client.post<any>("darPermisosObrasAsistencia", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const getObrasPermisos = async (): Promise<ResponseObrasPermisosAsistencia> => {
  return await client.get("obras-app-permisos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};