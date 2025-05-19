/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseInfoProyectosDash } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const infoCartDash = async (): Promise<ResponseInfoProyectosDash> => {
  return await client.get("info-dashboard-card", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

