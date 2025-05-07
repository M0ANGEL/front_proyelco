import React from "react";

export interface Props{
    open: boolean;
    setOpen: (value: boolean) => void;
    id_activo?: React.Key;
}