export interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    addPadre: (value: string) => void;
    padres: string[];
  }