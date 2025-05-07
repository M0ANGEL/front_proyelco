import { Paciente } from "@/services/types";

export interface Props {
  pacientes: Paciente[];
  open: boolean;
  setOpen: (value: boolean) => void;
  setPaciente: (value: Paciente | undefined) => void;
}
