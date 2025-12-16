import { client } from "../client";

export const getLinkPowerBi = async (data: any): Promise<any> => {
  return await client.post<any>("manejo-informes-powerBi", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};