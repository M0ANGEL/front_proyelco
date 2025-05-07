/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseStatistics, Statistics } from "../types";

export const getStatistics = async (
  bodega_id: string,
  empresa_id: string
): Promise<ResponseStatistics> => {
  return await client.get<{
    data: Statistics;
    status: string;
  }>(`statistics?bodega=${bodega_id}&empresa=${empresa_id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
