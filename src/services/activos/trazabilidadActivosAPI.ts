import { clientActivos } from "../client";

export const getTrazabilidad = async (id: React.Key): Promise<any> => {
    return await clientActivos.get<any>(`trazabilidad-activos/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };