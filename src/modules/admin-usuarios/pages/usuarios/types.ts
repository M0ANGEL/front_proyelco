import { Bodega, UserAliados } from "@/services/types";

export interface Usuario {
  user: User;
  bodegas: BodegasxUsuario[];
  empresas: EmpresaxUsuario[];
  perfiles: PerfilesxUsuario[];
  cargos: CargosxUsuario[];
  documentos: DocumentosXUsuario[];
  aliado: UserAliados[];
  fuentes: string[];
}

export interface BodegasxUsuario {
  id: number;
  id_bodega: string;
  id_user: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  bodega: Bodega;
}

// export interface Bodega {
//   id: number;
//   bod_nombre: string;
//   bod_localicad: string;
//   bod_cencosto: string;
//   bod_tercero: string;
//   estado: string;
//   created_at: Date;
//   updated_at: Date;
//   id_contrato: string;
//   id_empresa: string;
// }

export interface EmpresaxUsuario {
  id: number;
  id_empresa: string;
  id_user: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  empresa: Empresa;
}

export interface Empresa {
  id: number;
  emp_nombre: string;
  estado: string;
  nit: string;
  direccion: string;
  telefono: string;
  servidor_smtp: string;
  protocolo_smtp: string;
  cuenta_de_correo: string;
  contrasena_correo: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  cedula: string;
  nombre: string;
  telefono: string;
  cargo: string;
  username: string;
  image: string;
  last_login: Date;
  rol: string;
  created_at: Date;
  updated_at: Date;
  estado: string;
  has_bodegas: string;
  bodegas_habilitadas: number[];
  has_fuentes: string;
  correo: string;
  proceso_id: string;
  has_limite_reportes: string;
  moderador_tickets: string;
  horario_id: string;
  can_config_telefono: string;

}

export interface PerfilesxUsuario {
  id: number;
  id_perfil: string;
  id_user: string;
  created_at: Date;
  updated_at: Date;
  perfil: Perfil;
}

export interface CargosxUsuario {
  id: number;
  id_cargo: string;
  id_user: string;
  created_at: Date;
  updated_at: Date;
  cargo: Cargo;
}

export interface Perfil {
  id: number;
  cod_perfil: string;
  nom_perfil: string;
  desc_perfil: string;
  estado: string;
  id_empresa: string;
  empresa: Empresa;
  created_at: Date;
  updated_at: Date;
}

export interface Cargo {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
  id_empresa: string;
  created_at: Date;
  updated_at: Date;
  empresas: Empresa;
}

export interface DocumentosXUsuario {
  id: number;
  id_empresa: string;
  id_tipoDocu: string;
  id_user: string;
  consultar: string;
  crear: string;
  modificar: string;
  anular: string;
  created_at: Date;
  updated_at: Date;
  empresa_info: Empresa;
  documento_info: TipoDocumento;
}

export interface TipoDocumento {
  id: number;
  codigo: string;
  consecutivo: number;
  descripcion: string;
  id_empresa: string;
  id_grupo: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}
