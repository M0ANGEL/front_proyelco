import { Images } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  adjuntos: Images[];
}
