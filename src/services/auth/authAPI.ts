/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginFormInput } from "@/modules/auth/pages/LoginPage/types";
import { client } from "../client";
import {
  ResponseLogin,
  ResponseProfile,
  ResponseUserBodegas,
  ResponseUserDocuments,
  UserData,
} from "../types";

export const validateLogin = async (
  body: LoginFormInput
): Promise<ResponseLogin> => {
  let public_ip = "";
  await fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      public_ip = data.ip;
    })
    .catch((error) => {
      console.error("Error fetching IP:", error);
    });
  return await client.post("login", body, {
    headers: { Public: public_ip },
  });
};

export const fetchUserProfile = async (): Promise<ResponseProfile> => {
  return await client.get<{ userData: UserData; message: string }>(
    "user-profile",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const logout = async () => {
  return await client.post<string>(
    "logout",
    {},
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const fetchUserDocuments = async (): Promise<ResponseUserDocuments> => {
  return await client.get<{ data: UserData; status: string }>(
    "user-documentos",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const fetchUserBodegas = async (): Promise<ResponseUserBodegas> => {
  return await client.get<{ data: UserData; status: string }>("user-bodegas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cleanSessions = async (data: any) => {
  return await client.post<string>("clear-sessions", data);
};


//llamado a si es moderador
export const fetchUserProfileModerador = async (): Promise<ResponseProfile> => {
  return await client.get<{ userData: UserData; message: string }>(
    "user-profile",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
