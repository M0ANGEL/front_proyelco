import { client } from "../client";
import { ResponseLocalidad, ResponsePaises } from "../types";

export const getLocalidades = async (): Promise<ResponseLocalidad> => {
  return await client.get("localidades", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPaises = async (): Promise<ResponsePaises> => {
  return await client.get("paises", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
