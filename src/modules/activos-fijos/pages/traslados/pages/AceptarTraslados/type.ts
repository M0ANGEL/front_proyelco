export interface DataType {
    key: React.Key;
    id_activo : number;
    nombre_Activo: string,
    fecha_traslado: Date;
    bodega_origen: string;
    bodega_destino: string;
    user_origen: string;
    user_destino: string;
    estado : string;
    fecha_recibido: Date;
    descripcion: string;
}