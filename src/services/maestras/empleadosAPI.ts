/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseEmpleado } from "../types";


export const getEmpleados = async (): Promise<ResponseEmpleado> => {
  return await client_gestion.get("empleados", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearEmpleado = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("empleados", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getEmpleado = async (id: string): Promise<any> => {
  return await client_gestion.get<any>(`empleados/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusEmpleado = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`empleados/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateEmpleado = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`empleados/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

/**
 * Lista de empleados activos
 * @returns Empleados activos
 */
export const getEmpleadosOn = async (): Promise<ResponseEmpleado> => {
  return await client_gestion.get("empleadoson", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

/**
 * Lista de empleados activos con sus contratos
 * @returns Empleados activos con sus contratos
 */
export const empleadosActivos = async (): Promise<ResponseEmpleado> => {
  return await client_gestion.get("empleadosActivos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

/**
 * Listar empleados que ganan menos de dos salarios minimos
 * @returns array data
 */
export const getEmpleadosSalarioMinimo = async (): Promise<ResponseEmpleado> => {
  return await client_gestion.get("empleadossalariominimo", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

