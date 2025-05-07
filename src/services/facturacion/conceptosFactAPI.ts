/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ConceptoFact,
  ResponseConceptosFact,
  ResponseConceptoFact,
} from "../types";

export const getConceptosFact = async (): Promise<ResponseConceptosFact> => {
  return await client.get<{ data: ConceptoFact[]; status: string }>(
    "conceptos-facturacion",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const setStatusConceptoFact = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`conceptos-facturacion/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getConceptoFact = async (
  id: string
): Promise<ResponseConceptoFact> => {
  return await client.get<{ data: ConceptoFact; status: string }>(
    `conceptos-facturacion/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const crearConceptoFact = async (data: any): Promise<any> => {
  return await client.post<any>("conceptos-facturacion", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateConceptoFact = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`conceptos-facturacion/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
