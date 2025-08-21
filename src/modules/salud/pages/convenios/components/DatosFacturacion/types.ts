import { SelectProps } from "antd";

// Definimos cómo luce un proceso
export interface Proceso {
  proyecto_id: number;
  numero: string;
  proceso: string; // opcional si lo necesitas
  nombre_proceso: string; 
  // agrega aquí los campos que realmente tienes
}

export interface Props {
  selectTipoProyecto?: SelectProps["options"];
  selectUSuarios?: SelectProps["options"];
  selectIngeniero?: SelectProps["options"];
  procesos?: Proceso[]; // 👈 ahora es un arreglo de procesos
}

