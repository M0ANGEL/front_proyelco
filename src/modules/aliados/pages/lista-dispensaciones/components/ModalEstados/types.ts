export interface Props {
  open: boolean;
  setOpen: (value: boolean, fetch: boolean) => void;
  dispensaciones: React.Key[];
}
