/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { KardexConsolidado, KardexDetallado, ResponseKardexConsolidado, ResponseKardexDetallado } from "../types";

export const getKardexDetallado = async (
  data: any
): Promise<ResponseKardexDetallado> => {
  return await client.post<{
    status: string;
    data: KardexDetallado[];
    saldoAnterior: number;
  }>("kardex/detallado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getKardexConsolidado = async (
  data: any
): Promise<ResponseKardexConsolidado> => {
  return await client.post<{
    status: string;
    data: KardexConsolidado[];
    saldoAnterior: number;
  }>("kardex/consolidado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
