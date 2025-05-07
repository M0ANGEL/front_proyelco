import { Activos, UserData } from "@/services/types";

export interface DataType{
    key:number;
    id_activo: number;
    id_usuario: number;
    estado: string;
    activo: Activos;
    user_info: UserData;
}