import { Datos } from "@/services/types";

export interface dataSoat{
    datos: Datos[],
    id_activo: number,
    nombre_activo: string,
    fecha_compra: string,
    fecha_vencimiento: string,
    alerta: string,
}

export interface dataTecno{
    datos: Datos[],
    id_activo: number,
    nombre_activo: string,
    fecha_compra: string,
    fecha_vencimiento: string,
    alerta: string,
}


export interface dataImpuestosRodamiento{
    datos: Datos[],
    id_activo: number,
    nombre_activo: string,
    fecha_compra: string,
    fecha_vencimiento: string,
    alerta: string,
}

export interface dataSeguro{
    datos: Datos[],
    id_activo: number,
    fecha_compra: Date,
    fecha_vencimiento: Date,
    alerta: string,
    nombre_seguro: string,
    tipo_seguro: string,
}

export interface dataMantenimiento{
    id_activo: number,
    activo: string,
    fecha_mantenimiento: string,
    fecha_fin_mantenimiento: string,
    alerta: string,
    tipo_mantenimiento: string,
}