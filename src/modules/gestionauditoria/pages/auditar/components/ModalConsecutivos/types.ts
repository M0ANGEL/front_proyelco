export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  consecutivos: { consecutivo: string; estado: string }[];
}
