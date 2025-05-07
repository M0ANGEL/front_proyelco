export interface ResponsePlanoAliados {
  status: string;
  message: string;
  errores: ErroresAliados[];
  items: ItemsAliados[];
}

export interface ErroresAliados {
  columna: string;
  fila: number;
  message: string;
}

export interface ItemsAliados {
  consecutivo: string;
  fecha_documento: string;
  punto_entrega: string;
  observaciones: string;
  autorizacion_cabecera: string;
  tipo_consulta: string;
  fecha_formula: string;
  numero_formula: string;
  lugar_formula: string;
  tipo_documento_paciente: string;
  numero_documento_paciente: string;
  nombre_paciente: string;
  tipo_documento_medico: string;
  numero_documento_medico: string;
  nombre_medico: string;
  codigo_diagnostico: string;
  codigo_diagnostico_relacionado: string;
  despacho: string;
  autorizacion_detalle: string;
  codigo_producto: string;
  codigo_producto_sebthi: string;
  lote: string;
  fecha_vencimiento: string;
  dias_tratamiento: string;
  cant_solicitada: string;
  cant_entregada: string;
  precio_unitario: string;
  precio_subtotal: string;
  precio_iva: string;
  precio_total: string;
  modalidad: string;
  tipo_entrega: string;
}
