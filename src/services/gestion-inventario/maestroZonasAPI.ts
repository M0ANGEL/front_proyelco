/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseZonasBodega } from "../types";

export const getZonasBodega = async (
  bodega_id: string
): Promise<ResponseZonasBodega> => {
  return await client.get(`gestioninventario/zonas/${bodega_id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const updateZonaProducto = async (data: any): Promise<any> => {
  return await client.post(`gestioninventario/zonas/update-zona`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
