import {
  BASE_URL,
  BASE_URL_REP,
  BASE_URL_GESTION,
  BASE_URL_TK,
  BASE_URL_ACTIVOS,
  BASE_URL_ASISTENCIA,
} from "@/config/api";
import axios from "axios";

export const client = axios.create({
  baseURL: BASE_URL,
});

export const client_rep = axios.create({
  baseURL: BASE_URL_REP,
});

export const clientActivos = axios.create({
  baseURL: BASE_URL_ACTIVOS,
});

export const client_gestion = axios.create({
  baseURL: BASE_URL_GESTION,
});

export const client_tk = axios.create({
  baseURL: BASE_URL_TK,
});

export const client_aistencia = axios.create({
  baseURL: BASE_URL_ASISTENCIA,
});

