/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { Festivo, ResponseFestivos } from "../types";

export const getFestivos = async (): Promise<ResponseFestivos> => {
  return await client.get<{ data: Festivo[]; status: string }>("festivos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
export const updateFestivos = async (data: any): Promise<any> => {
  return await client.post("festivos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
