/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

export interface DataType {
  key: React.Key;
  bod_solicitante: string;
  num_docu: string;
  nompaciente: string;
  apepaciente: string;
  fecha: string;
  consecutivo: string;
  estado_auditoria: string;
  tiene_imagen: string;
  devolucion_dis: string;
  fecha_last_cargue: string;
  is_pago_pendiente: boolean;
}
