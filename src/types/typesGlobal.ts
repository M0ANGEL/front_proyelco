// types/typesGlobal.ts
export interface ResponseApi<T = any> {
  data: T;
  status: string;
  message?: string;
}

// Tipos para usuarios
export interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  telefono: string;
  cargo: string;
  username: string;
  image: string;
  last_login: string;
  rol: string;
  correo?: string;
  estado: number; // Cambiado a number para coincidir con la API
  created_at: string;
  updated_at: string;
  horario_id?: number | null;
  can_config_telefono: string;
  empresa: Empresa[];
  empresas: EmpresaxUsuario[];
  perfiles: Perfil[];
  cargos: Cargo[];
}

// export interface Empresa {
//   id: number;
//   emp_nombre: string;
//   estado: number;
//   nit: string;
//   direccion: string;
//   telefono: string;
//   cuenta_de_correo: string;
//   created_at: string;
//   updated_at: string;
//   pivot?: {
//     id_user: number;
//     id_empresa: number;
//   };
// }

export interface EmpresaxUsuario {
  id: number;
  id_empresa: string;
  id_user: string;
  estado: string;
  empresa: Empresa;
}

export interface Perfil {
  id: number;
  cod_perfil: string;
  nom_perfil: string;
  desc_perfil: string;
  estado: string;
}

// Respuestas de API
export interface ResponseUsers {
  status: string;
  data: Usuario[];
}

export interface ResponseUser {
  status: string;
  data: Usuario;
}

export interface ResponseCargo {
  data: {
    status: string;
    data: Cargo[];
  };
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

export interface ResponseEmpresas {
  data: {
    status: string;
    data: Empresa[];
  };
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
  created_at: string;
  updated_at: string;
}

export interface ResponsePerfil {
  data: Perfil[];
}

export interface Perfil {
  id: number;
  cod_perfil: string;
  nom_perfil: string;
  desc_perfil: string;
  estado: string;
  id_empresa: string;
  created_at: Date;
  updated_at: Date;
  modulos: ModulosXPerfil[];
  empresa: Empresa;
  menu: MenuElement[];
}

export interface ModulosXPerfil {
  id: number;
  id_modulo: string;
  id_menu: string;
  id_submenu: string;
  created_at: Date;
  updated_at: Date;
  menu: Menu;
  submenu: SubMenu;
  modulo: Modulo;
}

export interface MenuElement {
  key: string;
  cod_modulo: string;
  label: string;
  title: string;
  children?: MenuElement[];
}

export interface Modulo {
  id: number;
  cod_modulo: string;
  nom_modulo: string;
  desc_modulo: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  pivot: ModuloPivot;
  menus: Menu[];
}

export interface SubMenu {
  id: number;
  nom_smenu: string;
  link_smenu: string;
  desc_smenu: string;
  id_menu: string;
  created_at: Date;
  updated_at: Date;
  menu: Menu;
  estado: boolean;
}

export interface Menu {
  id: number;
  nom_menu: string;
  link_menu: string;
  desc_menu: string;
  id_modulo: string;
  created_at: Date;
  updated_at: Date;
  modulo: Modulo;
  estado: boolean;
  submenus: SubMenu[];
}

export interface ResponseSubMenus {
  data: SubMenu[];
}

export interface Modulo {
  id: number;
  cod_modulo: string;
  nom_modulo: string;
  desc_modulo: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  pivot: ModuloPivot;
  menus: Menu[];
}

export interface ModuloPivot {
  id_perfil: string;
  id_modulo: string;
}


//TIPOS GLOBALES
export interface ResponseAmClientes {
  data: {
    status: string;
    data: AmClientes[];
  };
}
export interface AmClientes {
  id: number;
  emp_nombre: string;
  estado: string;
  nit: number;
  direccion: string;
  telefono: string;
  cuenta_de_correo: string;
  id_user: string;
  nombre: string;
  created_at: string;
  updated_at: string;
}

//PROYECTOS
//tipo proyectos
export interface ResponseTipoProyectos {
  data: {
    status: string;
    data: TipoProyectos[];
  };
}

export interface TipoProyectos {
  id: number;
  nombre_tipo: string;
  user_id: string;
  nombre: string;
  created_at: string;
}

/* type de proceos proyecos */
export interface ResponseProcesosProyectos {
  data: {
    status: string;
    data: ProcesosProyectos[];
  };
}
export interface ProcesosProyectos {
  id: number;
  tipoPoryecto_id: string;
  nombre_tipo: string;
  estado: string;
  nombre_proceso: number;
  id_user: string;
  nombre: string;
  created_at: string;
  updated_at: string;
}

/* type de proyectos */
export interface ResponseProyectos {
  data: {
    status: string;
    data: Proyectos[];
  };
}
export interface Proyectos {
  id: number;
  tipoPoryecto_id: string;
  cliente_id: string;
  usuario_crea_id: string;
  encargado_id: string;
  descripcion_proyecto: string;
  fecha_inicio: string;
  codigo_proyecto: string;
  torres: string;
  cant_pisos: string;
  apt: string;
  pisoCambiarProceso: string;
  estado: string;
  fecha_ini_proyecto: string;
  nombre_tipo: string;
  emp_nombre: string;
  porcentaje: string;
  avance: string;
  avance_pisos: string;
  total_apartamentos: string;
  apartamentos_realizados: string;
  created_at: string;
  updated_at: string;
}

export interface Apartment {
  id: number;
  apartamento: string;
  consecutivo: string;
  estado: string;
  nombre: string;
  fecha_fin: string;
  fecha_habilitado: string;
  piso: string;
}

export interface Process {
  nombre_proceso: string;
  text_validacion: null | string;
  estado_validacion: number;
  validacion: number;
  pisos: {
    [floor: string]: Apartment[];
  };
  total_apartamentos: number;
  apartamentos_atraso: number;
  apartamentos_realizados: number;
  porcentaje_atraso: number;
  porcentaje_avance: number;
}

//CLIENTES
export interface ResponseAmClientes {
  data: {
    status: string;
    data: AmClientes[];
  };
}
export interface AmClientes {
  id: number;
  emp_nombre: string;
  estado: string;
  nit: number;
  direccion: string;
  telefono: string;
  cuenta_de_correo: string;
  id_user: string;
  nombre: string;
  created_at: string;
  updated_at: string;
}

//ASISTENCIAS TH
/* type de datos asistencias obras */
export interface ResponseAsistencia {
  data: {
    status: string;
    data: Asistencia[];
  };
}
export interface Asistencia {
  id: number;
  personal_id: string;
  proyecto_id: string;
  usuario_asigna: number;
  usuario_confirma: string;
  confirmacion: string;
  detalle: string;
  fecha_programacion: string;
  fecha_confirmacion: string;
  cargo: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  usurioConfirma: string;
  descripcion_proyecto: string;
  created_at: string;
  activo?: string; //columna virtual
  updated_at: string;
  created_at_string: string;
}

export interface ResponsePersonales {
  data: {
    status: string;
    data: Personales[];
  };
}
export interface Personales {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: number;
  estado: string;
  telefono: string;
  cargo_id: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseContratistasSST {
  data: {
    status: string;
    data: ContratistasSST[];
  };
}
export interface ContratistasSST {
  id: number;
  contratista: string;
  direccion: string;
  correo: string;
  telefono: string;
  nit: string;
  estado: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseEmpleadosTH {
  data: {
    status: string;
    data: EmpleadosTH[];
  };
}
export interface EmpleadosTH {
  id: number;
  estado: string;
  tipo_documento: string;
  identificacion: string;
  nombre_completo: string;
  fecha_expedicion: number;
  estado_civil: string;
  ciuda_expedicion_id: string;
  fecha_nacimiento: string;
  pais_residencia_id: string;
  ciudad_resudencia_id: string;
  genero: string;
  telefono_fijo: string;
  telefono_celular: string;
  direccion: string;
  correo: string;
  cargo_id: string;
  fecha_ingreso: string;
  salario: string;
  valor_hora: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseCargoTH {
  data: {
    status: string;
    data: cargosTH[];
  };
}
export interface cargosTH {
  id: number;
  estado: string;
  cargo: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ResponsePaisTH {
  data: {
    status: string;
    data: paisTH[];
  };
}
export interface paisTH {
  id: number;
  estado: string;
  pais: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseObrasPermisosAsistencia {
  data: {
    status: string;
    data: PermisosAsistencia[];
  };
}
export interface PermisosAsistencia {
  id: number;
  nombre: string;
  rango: string;
  usuarios_permisos: string;
}


//ACTIVOS FIJOS
export interface ResponseActivosCategoria {
  data: {
    status: string;
    data: ActivosCategoria[];
  };
}
export interface ActivosCategoria {
  id: number;
  prefijo: string;
  descripcion: string;
  estado: string;
  id_user: string;
  nombre: string;
  usuario: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseActivosSubCategoria {
  data: {
    status: string;
    data: ActivosSubCategoria[];
  };
}
export interface ActivosSubCategoria {
  id: number;
  descripcion: string;
  estado: string;
  id_user: string;
  nombre: string;
  usuario: string;
  categoria: string;
  categoria_id: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseActivosS {
  data: {
    status: string;
    data: ActivosData[];
  };
}
export interface ActivosData {
  id: number;
  key: number;
  numero_activo: string;
  categoria_id: string;
  subcategoria_id: string;
  descripcion: string;
  ubicacion_actual_id: string;
  valor: string;
  fecha_fin_garantia: string;
  condicion: string;
  updated_at: string;
  created_at: string;
  marca: string;
  serial: string;
  observacion: string;
  estado: string;
  usuario: string;
  categoria: string;
  subcategoria: string;
  bodega_actual: string;
  solicitud: string;
  motivo_solicitud: string;
  usuario_solicita: string;
}

export interface ResponseActivosMantenimiento {
  data: {
    status: string;
    data: ActivosMantenimiento[];
  };
}
export interface ActivosMantenimiento {
  id: number;
  valor: string;
  fecha_inicio: string;
  fecha_fin: string;
  observaciones: string;
  user_id: string;
  activo_id: string;
  estado: string;
  numero_activo: string;
  created_at: string;
  updated_at: string;
}


export interface ResponseBodegas_areas {
  data: {
    status: string;
    data: Bodegas_Areas[];
  };
}
export interface Bodegas_Areas {
  id: number;
  direccion: string;
  estado: string;
  id_user: string;
  nombre: string;
  created_at: string;
  updated_at: string;
  usuario: string;
}


//PROYECCION
export interface ResponseProyeccion {
  data: {
    status: string;
    data: Proyeccion[];
  };
}
export interface Proyeccion {
  id: number;
  codigo_proyecto: string;
  descripcion_proyecto: string;
  tipo_proyecto: string;
  total_registros: number;
  fecha_ultimo_registro: string;
  fecha_primer_registro: string;
  cantidad_total: string;
  valor_total_sin_iva: string;
  usuario_carga: string;
  created_at: string;
  updated_at: string;
}

//DOCUMENTACION

export interface ResponseDocumentacion {
  data: {
    status: string;
    data: Documentacion[];
  };
}
export interface Documentacion {
  id: number;
  codigo_proyecto: string;
  descripcion_proyecto: string;
  tipo_proyecto: string;
  total_registros: number;
  fecha_ultimo_registro: string;
  fecha_primer_registro: string;
  cantidad_total: string;
  valor_total_sin_iva: string;
  usuario_carga: string;
  created_at: string;
  updated_at: string;
}


/* CONTABILIDAD */
/* control gasolina */
export interface ResponsePlacas {
  data: {
    status: string;
    data: placas[];
  };
}
export interface placas {
  id: number;
  palca: string;
}


export interface ResponseCondcutores {
  data: {
    status: string;
    data: Condcutores[];
  };
}
export interface Condcutores {
  id: number;
  nombre_completo: string;
}


//rutas power bi
export interface ResponseRutasPowerBI {
  data: {
    status: string;
    data: RutasPowerBI[];
  };
}
export interface RutasPowerBI {
  id: number;
  nombre: string;
  estado: string;
  ruta: number;
  link_power_bi: string;
  created_at: string;
  updated_at: string;
}