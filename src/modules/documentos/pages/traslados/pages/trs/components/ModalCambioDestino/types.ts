import { UserData } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  userData?: UserData;
  trsID?: React.Key;
  consecutivo?: string;
}
