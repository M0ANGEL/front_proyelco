import { Paciente } from "@/services/types";

export interface Props {
  paciente?: Paciente;
  hasFuente: boolean;
  // alertaButton: boolean
  setAlertaButton: (value: boolean) => void;
}
