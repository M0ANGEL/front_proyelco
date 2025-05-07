import { Paciente } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  paciente?: Paciente;
  setPaciente: (value: Paciente) => void;
  numero_identificacion?: string;
  tipo_documento?: string;
}
