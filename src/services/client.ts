import {
  BASE_URL,
  BASE_SICO,
} from "@/config/api";
import axios from "axios";

export const client = axios.create({
  baseURL: BASE_URL,
});

export const client_sinco = axios.create({
  baseURL: BASE_SICO,
});

