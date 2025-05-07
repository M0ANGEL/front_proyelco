import { clientActivos } from "../client";

export const getTrazabilidadTraslados = async (id: React.Key): Promise<any> => {
    return await clientActivos.get<any>(`trazabilidad-traslados/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };