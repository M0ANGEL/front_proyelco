/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, ResponseMenu, ResponseMenus } from "@/types/auth.types";
import { client } from "../client";

export const getMenus = async (): Promise<ResponseMenus> => {
  return await client.get<Menu[]>("menu", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const getMenu = async (id: string): Promise<ResponseMenu> => {
  return await client.get<Menu>(`menu/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const crearMenu = async (data: any): Promise<any> => {
  return await client.post<any>("menu", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const updateMenu = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`menu/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};
