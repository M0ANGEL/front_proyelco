import { User } from "@/modules/admin-usuarios/pages/usuarios/types";
import { Activos } from "@/services/types";

export interface dataSourceMantenimiento{
    id: number,
    id_activo: string,
    fecha_mantenimiento: Date,
    tipo_mantenimiento: string,
    descripcion_mantenimiento: string,
    valor_mantenimiento: Float32Array,
    observacion_mantenimiento: string,
    id_usuario: number,
    id_tercero: number,
    user_info: User,
    activo: Activos,


}