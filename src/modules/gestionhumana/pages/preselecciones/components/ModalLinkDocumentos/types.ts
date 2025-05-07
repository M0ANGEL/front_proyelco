export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  id: string | null;
  documento: string | null;
  urlHost: string | null;
}