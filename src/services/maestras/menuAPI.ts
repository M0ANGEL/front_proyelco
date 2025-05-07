/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseMenu, ResponseMenus, Menu } from "../types";

export const getMenus = async (): Promise<ResponseMenus> => {
  return await client.get<Menu[]>("menu", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getMenu = async (id: string): Promise<ResponseMenu> => {
  return await client.get<Menu>(`menu/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearMenu = async (data: any): Promise<any> => {
  return await client.post<any>("menu", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateMenu = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`menu/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
