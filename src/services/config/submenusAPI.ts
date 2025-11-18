/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseSubMenu, ResponseSubMenus, SubMenu } from "@/types/auth.types";
import { client } from "../client";

export const getSubMenus = async (): Promise<ResponseSubMenus> => {
  return await client.get<SubMenu[]>("submenu", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const getSubMenu = async (id: string): Promise<ResponseSubMenu> => {
  return await client.get<SubMenu>(`submenu/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const crearSubMenu = async (data: any): Promise<any> => {
  return await client.post<any>("submenu", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const updateSubMenu = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`submenu/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};
