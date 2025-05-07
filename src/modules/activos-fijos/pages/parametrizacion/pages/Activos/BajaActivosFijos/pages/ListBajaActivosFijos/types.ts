export interface dataChatarra{
    id: number,
    id_activo: number,
    nombre_activo: string,
    nombre_usuario: string,
    descripcion: string,
    motivo: string,
    empresa_chatarra: string,
    localizacion: string,
    fecha_eliminacion: Date,
    estado: string,

}

export interface dataVendido{
    id: number,
    id_activo: number,
    nombre_activo: string,
    nombre_usuario: string,
    descripcion: string,
    motivo: string,
    empresa_venta: string,
    localizacion: string,
    precio_venta: number,
    fecha_eliminacion: Date,
    estado: string,

}

export interface dataDonacion{
    id:number
    id_activo: number,
    nombre_activo: string,
    nombre_usuario: string,
    descripcion: string,
    motivo: string,
    empresa_donacion: string,
    localizacion: string,
    fecha_eliminacion: Date,
    estado: string,
}

export interface dataPendientes{
    id:number
    id_activo: number,
    nombre_activo: string,
    nombre_usuario: string,
    descripcion: string,
    motivo: string,
    empresa_donacion: string,
    empresa_venta: string,
    empresa_chatarra: string,
    precio_venta: number,
    localizacion: string,
    fecha_eliminacion: Date,
    estado: string,
}

