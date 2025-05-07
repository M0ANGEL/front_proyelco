import { client_gestion } from "../client";
import { ResponseOtrosi, ResponseOtrosis } from "../types";


export const getOtrosis = async (id: any): Promise<ResponseOtrosis> => {

  return await client_gestion.get('otrosis/' + id, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getOtrosi = async (id: React.Key): Promise<ResponseOtrosi> => {
  return await client_gestion.get(`otrosi/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateOtrosi = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`otrosis/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};