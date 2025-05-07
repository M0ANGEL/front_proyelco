import { clientActivos } from "../client";
import { ResponseDepreciacion } from "../types";

export const getDepreciacion = async (
  id_activo: Number
): Promise<ResponseDepreciacion> => {
  return await clientActivos.get(`trazabilidad-depreciacion/${id_activo}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const getTrazabilidadDepreciacion = async (id: React.Key): Promise<any> => {
    return await clientActivos.get<any>(`depreciacion-historico/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };
