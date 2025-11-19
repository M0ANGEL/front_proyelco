import { Cargo, Empresa, EmpresaxUsuario } from "./typesGlobal";

export interface MenuItem {
  key: string;
  cod_modulo: string;
  label: string;
  title: string;
  order: number;
  children?: MenuItem[];
}

export interface SubMenu {
  id: number;
  nom_smenu: string;
  link_smenu: string;
  desc_smenu: string;
  id_menu: number;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: number;
  nom_menu: string;
  link_menu: string;
  desc_menu: string;
  id_modulo: number;
  created_at: string;
  updated_at: string;
}

export interface Modulo {
  id: number;
  cod_modulo: string;
  nom_modulo: string;
  desc_modulo: string;
  estado: number;
  created_at: string;
  updated_at: string;
}

export interface PerfilModulo {
  id: number;
  id_modulo: number;
  id_perfil: number;
  id_menu: number;
  id_submenu: number | null;
  created_at: string;
  updated_at: string;
  modulo: Modulo;
  menu: Menu;
  submenu: SubMenu | null;
}

export interface Perfil {
  id: number;
  cod_perfil: string;
  nom_perfil: string;
  desc_perfil: string;
  estado: number;
  id_empresa: number;
  created_at: string;
  updated_at: string;
  menu: MenuItem[];
  pivot: {
    id_user: number;
    id_perfil: number;
  };
  modulos: PerfilModulo[];
}

export interface User {
  id: number;
  cedula: string;
  nombre: string;
  telefono: string;
  cargo: string;
  username: string;
  image: string;
  last_login: string;
  rol: string;
  correo: string | null;
  estado: number;
  created_at: string;
  updated_at: string;
  horario_id: number | null;
  can_config_telefono: string;
  perfiles: Perfil[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ProfileResponse {
  status: string;
  userData: User;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}


export interface ResponseModulo {
  data: Modulo;
}

export interface ResponseModulos {
  data: Modulo[];
}

export interface ResponseSubMenus {
  data: SubMenu[];
}

export interface ResponseSubMenu {
  data: SubMenu;
}

export interface ResponseMenus {
  data: Menu[];
}

export interface ResponseMenu {
  data: Menu;
}

//USUARIO LOGUIN
export interface ResponseLogin {
  data: Token;
}

export interface Token {
  token: string;
}

export interface ResponseProfile {
  data: {
    userData: UserData;
    message: string;
  };
}

export interface ResponseEmpresas {
  data: {
    status: string;
    data: Empresa[];
  };
}

export interface ResponseEmpresa {
  data: {
    status: string;
    data: Empresa;
  };
}

export interface ResponseUsers {
  data: {
    status: string;
    data: UserData[];
  };
}
export interface ResponseUser {
  data: {
    data: UserData;
  };
}

export interface UserData {
  id: number;
  nombre: string;
  username: string;
  password: string;
  image: string;
  last_login: Date;
  rol: string;
  id_empresa: string;
  estado: string;
  cargo: string;
  cedula: string;
  telefono: string;
  created_at: Date;
  updated_at: Date;
  empresa: Empresa[];
  empresas: EmpresaxUsuario[];
  perfiles: Perfil[];
  cargos: Cargo[];
  has_bodegas: string;
  bodegas_habilitadas: number[];
  has_fuentes: string;
  fuentes: string[];
  has_limite_reportes: string;
  proceso_id: number;
  horario_adicional: {
    fecha_inicio: string; // "HH:mm"
    fecha_final: string; // "HH:mm"
  };
}