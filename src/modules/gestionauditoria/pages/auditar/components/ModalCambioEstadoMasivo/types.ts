import { UserData } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean, origen: string) => void;
  userGlobal?: UserData;
  idsSeleccionados: React.Key[];
}
