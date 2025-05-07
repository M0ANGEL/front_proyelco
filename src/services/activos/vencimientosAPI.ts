/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientActivos } from "../client";


export const obtenerAlertas = async () => {
  const response = await clientActivos.get('/alertas', {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return response.data;
};  


export const RenovarParametros = async (
    data: FormData, 
    idUser: number,
    parametroId: number,
  ): Promise<any> => {
    return await clientActivos.post<any>(
      `parametros-renovar/${parametroId}`,data,
      {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}` ,
        },
        params: {
          idUser: idUser,
        },
      }
    );
  };
