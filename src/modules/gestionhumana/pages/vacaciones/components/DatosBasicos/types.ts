import { Vacaciones } from "@/services/types";
import { SelectProps } from "antd";

export interface Props {
  
  vacacion?: Vacaciones;
  selectEmpleado: SelectProps["options"];
  selectTipoCarta: SelectProps["options"];
}