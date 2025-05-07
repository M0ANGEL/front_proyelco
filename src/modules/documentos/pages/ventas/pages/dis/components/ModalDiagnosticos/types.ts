import { Diagnostico } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  diagnosticos: Diagnostico[];
  setDiagnostico: (value: Diagnostico) => void;
}
