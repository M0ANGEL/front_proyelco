/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {  ResponseProyeccion } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getProyectosProyeciones = async (): Promise<ResponseProyeccion> => {
  return await client.get("proyectos-proyeccio", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

