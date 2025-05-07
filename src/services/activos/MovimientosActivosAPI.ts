import { clientActivos } from "../client";
import { Activos, ResponseListActivos } from "../types";

export const getListaActivosSubCategoria = async (
  categoria: string
): Promise<ResponseListActivos> => {
  const response = await clientActivos.get<{
    data: Activos[];
    status: string;
    total: number;
    per_page: number;
  }>(`activos-subcategoria/${categoria}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};
