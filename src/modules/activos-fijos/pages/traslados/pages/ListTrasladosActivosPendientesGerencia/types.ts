import { Activos } from "@/services/types";

export interface DataType {
    key: React.Key;
    id_activo : string;
    activo: Activos;
    fecha_traslado: Date;
    bodega_origen: string;
    bodega_destino: string;
    user_origen: string;
    user_destino: string;
    estado : string;
    fecha_recibido: Date;
    descripcion: string;
}