import { Medico } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  medico?: Medico;
  setMedico: (value: Medico) => void;
  numero_identificacion?: string;
}
