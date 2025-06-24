/* eslint-disable @typescript-eslint/ban-types */
import {
  BodegasxUsuario,
  EmpresaxUsuario,
  User,
} from "@/modules/admin-usuarios/pages/usuarios/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  bodega: BodegasxUsuario[];
  empresa: Empresa[];
  empresas: EmpresaxUsuario[];
  perfiles: Perfil[];
  tipos_documentos: TipoDocumento[];
  cargos: Cargo[];
  has_bodegas: string;
  bodegas_habilitadas: number[];
  user_aliado: UserAliados;
  has_fuentes: string;
  fuentes: string[];
  fuentes_info: FuentesxUsuario[];
  has_limite_reportes: string;
  proceso_id: number;
  horario: Horario; // Usamos la nueva interfaz aquí
  horario_adicional: {
    fecha_inicio: string; // "HH:mm"
    fecha_final: string; // "HH:mm"
  };
}

export interface HorarioDetalle {
  dia: string;
  hora_inicio: string; // "HH:mm"
  hora_final: string; // "HH:mm"
}

export interface Horario {
  inicio: string; // "HH:mm"
  fin: string; // "HH:mm"
  detalles: HorarioDetalle[]; // Agregamos detalles aquí
}

export interface ResponseBodegas {
  data: {
    status: string;
    data: Bodega[];
  };
}

export interface ResponseBodega {
  data: {
    status: string;
    data: Bodega;
  };
}
export interface Bodega {
  id: number;
  bod_nombre: string;
  bod_localicad: string;
  bod_cencosto: string;
  bod_tercero: string;
  id_contrato: string;
  prefijo: string;
  direccion: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  id_empresa: string;
  empresa: Empresa;
  pivot: BodegaPivot;
  localidad: Localidades;
  tipo_bodega: string;
  estado_inventario: string;
}

export interface BodegaPivot {
  id_user: string;
  id_bodega: string;
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
  pivot?: EmpresaPivot;
}

export interface EmpresaPivot {
  id_user: string;
  id_empresa: string;
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

export interface ModuloPivot {
  id_perfil: string;
  id_modulo: string;
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

export interface Modulo {
  id: number;
  cod_modulo: string;
  nom_modulo: string;
  desc_modulo: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
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

export interface ResponseModulos {
  data: Modulo[];
}

export interface ResponseModulo {
  data: Modulo;
}
export interface ResponseBlob {
  data: Blob;
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

export interface ResponseTipoDocumentos {
  data: TipoDocumento[];
  status?: string;
}

export interface ResponseTipoDocumento {
  data: {
    data: TipoDocumento;
    status: string;
  };
}

export interface ResponseGrupos {
  data: Grupo[];
}

export interface ResponseTipoDocumentoEmpresa {
  data: {
    data: TipoDocumento[];
    status?: string;
  };
}

export interface TipoDocumento {
  id: number;
  descripcion: string;
  codigo: string;
  consecutivo: number;
  id_grupo: string;
  id_empresa: string;
  estado: string;
  empresa?: Empresa;
  grupo?: Grupo;
  privilegios?: Privilegios;
  created_at: Date;
  updated_at: Date;
  cabeceras?: {
    id: number;
    id_campo: string;
    id_tipodocu: string;
    campo: Cabeceras;
    estado: string;
    created_at: Date;
    updated_at: Date;
  }[];
}

export interface Grupo {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface Cabeceras {
  id: number;
  nombre_campo: string;
  id_tipodocu: string;
  id_contrato: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseCabeceras {
  data: Cabeceras[];
}

export interface Producto {
  id: number;
  descripcion: string;
  principio_act: string;
  cod_barra: string;
  presentacion: string;
  forma_far: string;
  via_admin: string;
  ubicacion: string;
  laboratorio: string;
  invima: string;
  cum: string;
  expediente: string;
  atc: string;
  estado_invima: string;
  fecha_vig_invima: string;
  concentracion: string;
  uni_dispensacion: string;
  precio_compra: string;
  precio_promedio: string;
  iva_id: string;
  grupo_id: string;
  subgrupo_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  ivas: IvaProducto;
  cod_geminus: string;
  cant_presentacion: string;
  unidad_medida: string;
  p_regulado_compra: string;
  p_regulado_venta: string;
  circular_regulacion: string;
  pbs: string;
  cod_mipres: string;
  nivel_invima: string;
  cadena_frio: string;
  cod_padre: string;
  codigo_padre: ProductoPadre;
  ium: string;
  ium1: string;
  ium2: string;
  ium3: string;
  cod_huv: string;
  precio_venta: string;
  cod_tipo_medicamento: FormaFarma;
  tipo_medicamento_id: string;
  grupo_invima: string;
}

export interface ProductoPadre {
  id: number;
  cod_padre: string;
  descripcion: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductoPadre2 {
  id_padre: number;
  cod_padre: string;
  desc_padre: string;
}

export interface ResponseProductosPadre {
  data: {
    status: string;
    data: ProductoPadre[];
  };
}

export interface ResponseProductos {
  data: {
    data: {
      data: Producto[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseProductosLotePaginate {
  data: {
    data: {
      data: ProductoLote[];
      per_page: number;
      total: number;
      current: number;
    };
    status?: string;
  };
}

export interface ResponseSearchProductos {
  data: {
    data: Producto[];
    status: string;
  };
}

export interface ResponseProductosLote {
  data: {
    data: ProductoLote[];
    status: string;
  };
}

export interface ProductoLote {
  iva: any;
  precio_lista: any;
  id: number;
  descripcion: string;
  lote: string;
  fecha_vencimiento: string;
  stock: string;
  precio_promedio: string;
  precio_lista_precio: string;
  fecha_vig_invima: string;
  precio: string;
  bodega_id: string;
  producto_id: number;
  productos: Producto;
  estado: string;
  bodegas: Bodega;
  estado_invima: string;
  zona?: string;
  cod_huv: string;
}

export interface ResponseProductoGrupos {
  data: {
    status: string;
    data: GrupoProducto[];
  };
}

export interface ResponseDocumento {
  data: {
    status: string;
    data: Privilegios;
  };
}

export interface GrupoProducto {
  id: number;
  descripcion: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseProductoSubGrupos {
  data: {
    status: string;
    data: SubGrupoProducto[];
  };
}

export interface SubGrupoProducto {
  id: number;
  descripcion: string;
  grupo_id: string;
  grupo: GrupoProducto;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseProductoIvas {
  data: {
    status: string;
    data: IvaProducto[];
  };
}

export interface IvaProducto {
  id: number;
  iva: string;
  created_at: Date;
  updated_at: Date;
}

export interface Tercero {
  id: number;
  nit: string;
  digito_ver: string;
  nombre: string;
  razon_soc: string;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  direccion: string;
  telefono: string;
  correo_ele: string;
  ciudad: string;
  medio_pag: string;
  celular: string;
  barrio: string;
  estado: string;
  tipo_id: string;
  created_at: Date;
  updated_at: Date;
  tipo: string;
  tipo_persona: string;
  tipo_documento: string;
  remisiones_venta_directa?: RemisionVentaDirectaCabecera[];
  facturas_concepto?: FacturaConceptoCabecera[];
  facturas_fve_dis?: FacturaFVECabecera[];
  facturas_fve_rvd?: FacturaFVERvdCabecera[];
  facturas_venta_directa?: FacturaFVERvdCabecera[];
  lista_precios: ListaPrecios;
  convenios: Convenio[];
}

export interface ResponseTerceros {
  data: {
    data: {
      data: Tercero[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface TerceroTipo {
  id: number;
  descripcion: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseTerceroTipo {
  data: {
    status: string;
    data: TerceroTipo[];
  };
}

export interface ResponseSearchTerceros {
  data: {
    status: string;
    data: Tercero[];
  };
}

export interface ResponseSearchTercero {
  data: {
    status: string;
    data: Tercero;
  };
}

export interface ResponseSearchFP {
  data: {
    status: string;
    data: FacturaProveedorCabecera[];
  };
}

export interface ResponseSearchProductsxLP {
  data: {
    status: string;
    data: ProductoLP[];
  };
}

export interface ResponseUserDocuments {
  data: {
    status: string;
    data: UserData;
  };
}

export interface ResponseUserBodegas {
  data: {
    status: string;
    data: UserData;
  };
}

export interface ProductoLP {
  id: number;
  condigo: string;
  producto_id: string;
  lista_precio_id: string;
  precio: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  producto: Producto;
}

export interface Privilegios {
  id: number;
  consultar: string;
  crear: string;
  modificar: string;
  anular: string;
  id_user: string;
  id_tipoDocu: string;
  id_empresa: string;
  created_at: Date;
  updated_at: Date;
  documento_info: TipoDocumento;
}

export interface Traslados {
  id: number;
  observacion: string;
  estado: string;
  total: string;
  tipo_documento_id: string;
  bod_origen: Bodega;
  bod_destino: Bodega;
  user_id: string;
  user_acepta: User;
  user_anula: User;
  user: User;
  userAcepta: User;
  trs_id: string;
  tre_id: string;
  created_at: Date;
  updated_at: Date;
  detalle: TrasladosDet[];
  bodega: Bodega;
  estados: { estado: string };
  numero_servinte: string;
  traslado_salida: Traslados;
}

export interface TrasladosDet {
  id: number;
  cantidad: string;
  estado: string;
  numero_linea: string;
  trs_id: string;
  producto_id: string;
  created_at: Date;
  updated_at: Date;
  producto: Producto;
}

export interface ResponseListaRQP {
  data: {
    status: string;
    data: Rqp[];
  };
}

export interface ResponseListarRQP {
  data: {
    data: {
      data: Rqp[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseListaOC {
  data: {
    data: {
      data: OrdenCompraCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseListaFP {
  data: {
    status: string;
    data: {
      data: FacturaProveedorCabecera[];
      per_page: number;
      total: number;
    };
  };
}

export interface ResponseInfoFP {
  data: {
    status: string;
    data: FacturaProveedorCabecera;
  };
}

export interface ResponseListaDP {
  data: {
    data: {
      data: DevolucionProveedorCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseListaDevolucion {
  data: {
    data: {
      data: DevolucionDispensacionCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoDevolucion {
  data: {
    status: string;
    data: DevolucionDispensacionCabecera;
  };
}

export interface ResponseInfoDP {
  data: {
    status: string;
    data: DevolucionProveedorCabecera;
  };
}

export interface ResponseInfoRQP {
  data: {
    status: string;
    data: Rqp;
  };
}

export interface ResponseOCxRQP {
  data: {
    status: string;
    data: OrdenCompraCabecera[];
  };
}

export interface ResponseInfoOC {
  data: {
    status: string;
    data: OrdenCompraCabecera;
  };
}

export interface Rqp {
  id: number;
  bod_solicitante: string;
  observacion: string;
  estado: string;
  tipo_documento_id: string;
  user_id: string;
  consecutivo: string;
  created_at: Date;
  updated_at: Date;
  usuario: User;
  tipo_documento: TipoDocumento;
  bodega: Bodega;
  detalle: RqpDetalle[];
  ordenes_compra: OrdenCompraCabecera[];
  total_cantidad_rqp: number;
  total_cantidad_oc: number;
  flag_total: boolean;
  distribucion_id: string;
  fecha_aprueba: string;
  usuario_aprueba: User;
}

export interface RqpDetalle {
  id: number;
  cantidad: string;
  estado: string;
  numero_linea: string;
  rqp_id: string;
  producto_id: string;
  created_at: Date;
  updated_at: Date;
  producto: Producto;
}

export interface FacturaProveedorCabecera {
  id: number;
  observacion: string;
  factura_nro: string;
  ipoconsumo: string;
  estado: string;
  subtotal: string;
  total: string;
  consecutivo: string;
  tipo_documento_id: string;
  user_id: string;
  oc_id: string;
  bodega_id: string;
  tercero_id: string;
  created_at: Date;
  updated_at: Date;
  temperatura: string;
  nro_guia: string;
  nro_cajas: string;
  usuario: User;
  detalle: Array<FacturaProveedorDetalle[]>;
  bodega: Bodega;
  tipo_documento: TipoDocumento;
  oc_cabecera: OrdenCompraCabecera;
  tercero: Tercero;
  distribucion_id: string;
}

export interface FacturaProveedorDetalle {
  id: number;
  cantidad: string;
  estado: string;
  lote: string;
  fecha_vencimiento: Date;
  numero_linea: string;
  precio_compra: string;
  iva: string;
  precio_total: string;
  fp_id: string;
  producto_id: string;
  created_at: Date;
  updated_at: Date;
  producto: Producto;
}

export interface DevolucionProveedorCabecera {
  id: number;
  observacion: string;
  estado: string;
  subtotal: string;
  total: string;
  consecutivo: string;
  tipo_documento_id: string;
  user_id: string;
  fp_id: string;
  bodega_id: string;
  tercero_id: string;
  created_at: Date;
  updated_at: Date;
  usuario: User;
  detalle: Array<DevolucionProveedorDetalle[]>;
  bodega: Bodega;
  tipo_documento: TipoDocumento;
  fp_cabecera: FacturaProveedorCabecera;
  tercero: Tercero;
}

export interface DevolucionProveedorDetalle {
  id: number;
  cantidad: string;
  estado: string;
  lote: string;
  fecha_vencimiento: Date;
  numero_linea: string;
  precio_compra: string;
  iva: string;
  precio_total: string;
  dp_id: string;
  producto_id: string;
  created_at: Date;
  updated_at: Date;
  producto: Producto;
}

export interface OrdenCompraCabecera {
  id: number;
  observacion: string;
  subtotal: string;
  total: string;
  bodega_id: string;
  rqp_id: string;
  tipo_documento_id: string;
  user_id: string;
  tercero_id: string;
  consecutivo: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  domicilio: string;
  detalle: OrdenCompraDetalle[];
  bodega: Bodega;
  bodega_destino: Bodega;
  tercero: Tercero;
  rqp_cabecera: Rqp;
  usuario: User;
  facturas_abiertas: FacturaProveedorCabecera[];
  porc_descuento: string;
  total_descuento: string;
  distribucion_id: string;
}

export interface OrdenCompraDetalle {
  id: number;
  numero_linea: string;
  cantidad: string;
  precio_compra: string;
  iva: string;
  precio_total: string;
  oc_id: string;
  producto_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  producto: Producto;
  porc_descuento: string;
  total_descuento: string;
}

export interface DevolucionDispensacionCabecera {
  id: number;
  observacion: string;
  estado: string;
  subtotal: string;
  total: string;
  consecutivo: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  paciente_id: string;
  created_at: Date;
  updated_at: Date;
  cuota_moderadora_dis: string;
  detalle: DevolucionDispensacionDetalle[];
  bodega: Bodega;
  usuario: User;
  paciente: Paciente;
  numero_servinte: string;
  id_fuente: string;
  fuente: Fuentes;
}

export interface DevolucionDispensacionDetalle {
  id: number;
  lote: string;
  fecha_vencimiento: Date;
  numero_linea: string;
  cantidad: string;
  precio_venta: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_total: string;
  det_dis_id: string;
  producto_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  producto: Producto;
  dis_detalle: IDispensacionDetalle;
}

export interface ResponseListaRVD {
  data: {
    data: {
      data: RemisionVentaDirectaCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoRVD {
  data: {
    data: RemisionVentaDirectaCabecera;
    status?: string;
  };
}

export interface RemisionVentaDirectaCabecera {
  id: number;
  consecutivo: string;
  observacion: string;
  estado: string;
  estado_facturacion: string;
  convenio_id: string;
  tercero_id: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  subtotal: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  convenio: Convenio;
  tercero: Tercero;
  usuario: User;
  bodega: Bodega;
  detalle: RemisionVentaDirectaDetalle[];
}

export interface RemisionVentaDirectaDetalle {
  id: number;
  numero_linea: string;
  cantidad: string;
  cantidad_dev: string;
  iva: string;
  precio_unitario: string;
  precio_subtotal: string;
  precio_iva: string;
  precio_total: string;
  costo_unitario: string;
  costo_subtotal: string;
  costo_impuesto: string;
  costo_total: string;
  estado: string;
  rvd_id: number;
  producto_lote_id: number;
  rvd_cabecera: RemisionVentaDirectaCabecera;
  lote: ProductoLote;
}

export interface ResponseListaDRV {
  data: {
    data: {
      data: DevolucionVentaDirectaCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoDRV {
  data: {
    data: DevolucionVentaDirectaCabecera;
    status?: string;
  };
}

export interface DevolucionVentaDirectaCabecera {
  id: number;
  consecutivo: string;
  observacion: string;
  estado: string;
  estado_facturacion: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  tercero_id: string;
  rvd_id: string;
  subtotal: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  usuario: User;
  bodega: Bodega;
  tercero: Tercero;
  detalle: DevolucionVentaDirectaDetalle[];
  rvd_cabecera: RemisionVentaDirectaCabecera;
}

export interface DevolucionVentaDirectaDetalle {
  id: number;
  numero_linea: string;
  cantidad: string;
  iva: string;
  precio_unitario: string;
  precio_venta: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_total: string;
  det_rvd_id: string;
  drv_id: string;
  producto_lote_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  rvd_detalle: RemisionVentaDirectaDetalle;
  lote: ProductoLote;
}

export interface ResponseListaFVC {
  data: {
    data: {
      data: FacturaConceptoCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoFVC {
  data: {
    data: FacturaConceptoCabecera;
    status?: string;
  };
}

export interface FacturaConceptoCabecera {
  id: number;
  consecutivo: string;
  nro_factura: string;
  observacion: string;
  estado: string;
  estado_facturacion: string;
  tercero_id: string;
  convenio_id: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  subtotal: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  cufe: string;
  fecha_facturacion: Date;
  numero_factura_vta: string;
  qrdata: string;
  respuesta: string;
  status_code: string;
  tercero: Tercero;
  usuario: User;
  bodega: Bodega;
  convenio: Convenio;
  detalle: FacturaConceptoDetalle[];
  convenios_relacionados: string;
  fecha_inicio_dis: string;
  fecha_fin_dis: string;
}

export interface FacturaConceptoDetalle {
  id: number;
  numero_linea: string;
  concepto: string;
  cantidad: string;
  cantidad_dev: string;
  valor_dev: string;
  iva: string;
  precio_unitario: string;
  precio_subtotal: string;
  precio_iva: string;
  precio_total: string;
  estado: string;
  fvc_id: number;
  fvc_cabecera: RemisionVentaDirectaCabecera;
  notas_credito: NotaCreditoConceptoDetalle[];
}

export interface ResponseListaNCC {
  data: {
    data: {
      data: NotaCreditoConceptoCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoNCC {
  data: {
    data: NotaCreditoConceptoCabecera;
    status?: string;
  };
}

export interface NotaCreditoConceptoCabecera {
  id: number;
  consecutivo: string;
  observacion: string;
  estado: string;
  estado_facturacion: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  tercero_id: string;
  convenio_id: string;
  fvc_id: string;
  subtotal: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  usuario: User;
  bodega: Bodega;
  tercero: Tercero;
  detalle: NotaCreditoConceptoDetalle[];
  fvc_cabecera: FacturaConceptoCabecera;
  cod_concepto_nc: string;
  desc_concepto_nc: string;
}

export interface NotaCreditoConceptoDetalle {
  id: number;
  numero_linea: string;
  concepto: string;
  cantidad: string;
  iva: string;
  precio_unitario: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_total: string;
  det_fvc_id: string;
  nce_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  fvc_detalle: FacturaConceptoDetalle;
}

export interface ResponseSearchFVE {
  data: {
    data: {
      data: FacturaFVECabecera[];
      per_page: number;
      total: number;
    };
    status: string;
  };
}

export interface ResponseInfoFacturaDis {
  data: {
    data: FacturaFVECabecera;
    status: string;
  };
}

export interface ResponseListaNCE {
  data: {
    data: {
      data: NotaCreditoFVEDisCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoNCE {
  data: {
    data: NotaCreditoFVEDisCabecera;
    status?: string;
  };
}

export interface NotaCreditoFVEDisCabecera {
  id: number;
  consecutivo: string;
  observacion: string;
  factura_tipo: string;
  numero_nce: string;
  numero_nota_credito: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  fecha_facturacion: string;
  qrdata: string;
  status_code: string;
  respuesta: string;
  cufe: string;
  estado: string;
  convenio_id: string;
  paciente_id: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  fve_dis_id: string;
  subtotal: string;
  impuesto: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  retorno_inventario: string;
  convenio: Convenio;
  paciente: Paciente;
  tipo_documento: TipoDocumento;
  usuario: User;
  bodega: Bodega;
  fve_cabecera: FacturaFVECabecera;
  detalle: NotaCreditoFVEDisDetalle[];
  libera_dis: string;
}

export interface NotaCreditoFVEDisDetalle {
  id: number;
  cantidad: string;
  cod_geminus: string;
  cod_mipres: string;
  codigo_producto: string;
  cum: string;
  fecha_vencimiento: string;
  invima: string;
  lote: string;
  numero_linea: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_venta: string;
  precio_venta_total: string;
  unidad_medida: string;
  nce_dis_cabecera_id: string;
  fve_dis_detalle_id: string;
  created_at: Date;
  updated_at: Date;
  lote_id: string;
  fve_detalle: FacturaFVEDetalle;
  producto: Producto;
}

export interface ResponseListaNCV {
  data: {
    data: {
      data: NotaCreditoFVERvdCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoNCV {
  data: {
    data: NotaCreditoFVERvdCabecera;
    status?: string;
  };
}

export interface NotaCreditoFVERvdCabecera {
  id: number;
  consecutivo: string;
  observacion: string;
  factura_tipo: string;
  numero_ncv: string;
  numero_nota_credito: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  fecha_facturacion: string;
  qrdata: string;
  status_code: string;
  respuesta: string;
  cufe: string;
  estado: string;
  convenio_id: string;
  tercero_id: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  fve_rvd_id: string;
  subtotal: string;
  impuesto: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  retorno_inventario: string;
  convenio: Convenio;
  tercero: Tercero;
  tipo_documento: TipoDocumento;
  usuario: User;
  bodega: Bodega;
  fve_cabecera: FacturaFVERvdCabecera;
  detalle: NotaCreditoFVERvdDetalle[];
}

export interface NotaCreditoFVERvdDetalle {
  id: number;
  cantidad: string;
  cod_geminus: string;
  cod_mipres: string;
  codigo_producto: string;
  cum: string;
  fecha_vencimiento: string;
  invima: string;
  lote: string;
  numero_linea: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_venta: string;
  precio_venta_total: string;
  unidad_medida: string;
  fve_rvd_detalle_id: string;
  created_at: Date;
  updated_at: Date;
  lote_id: string;
  fve_detalle: FacturaFVEDetalle;
  producto: Producto;
}

export interface ResponseListaOBP {
  data: {
    data: {
      data: ObsequioProveedorCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoOBP {
  data: {
    data: ObsequioProveedorCabecera;
    status?: string;
  };
}

export interface ObsequioProveedorCabecera {
  id: number;
  consecutivo: string;
  observacion: string;
  estado: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  tercero_id: string;
  subtotal: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  usuario: User;
  bodega: Bodega;
  tercero: Tercero;
  detalle: Array<ObsequioProveedorDetalle[]>;
}

export interface ObsequioProveedorDetalle {
  id: number;
  numero_linea: string;
  cantidad: string;
  iva: string;
  precio_unitario: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_total: string;
  obp_id: string;
  producto_lote_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  obp_cabecera: ObsequioProveedorCabecera;
  lote: ProductoLote;
}

export interface ResponseListaCGN {
  data: {
    data: {
      data: ConsignacionCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoCGN {
  data: {
    data: ConsignacionCabecera;
    status?: string;
  };
}

export interface ConsignacionCabecera {
  id: number;
  consecutivo: string;
  observacion: string;
  estado: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  tercero_id: string;
  subtotal: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  usuario: User;
  bodega: Bodega;
  tercero: Tercero;
  detalle: Array<ConsignacionDetalle[]>;
}

export interface ConsignacionDetalle {
  id: number;
  numero_linea: string;
  cantidad: string;
  iva: string;
  precio_unitario: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_total: string;
  obp_id: string;
  producto_lote_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  cgn_cabecera: ConsignacionCabecera;
  lote: ProductoLote;
}

export interface ResponseListaIA {
  data: {
    data: {
      data: InventarioAperturaCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoIA {
  data: {
    data: InventarioAperturaCabecera;
    status?: string;
  };
}

export interface InventarioAperturaCabecera {
  id: number;
  consecutivo: string;
  observacion: string;
  estado: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  subtotal: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  user: User;
  bodega: Bodega;
  detalle: InventarioAperturaDetalle[];
}

export interface InventarioAperturaDetalle {
  id: number;
  cabecera_id: string;
  producto_id: string;
  descripcion: string;
  cantidad: string;
  precio_promedio: string;
  lote: string;
  fecha_vencimiento: string;
  numero_linea: string;
  iva: string;
  subtotal: string;
  estado: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  cabecera: InventarioAperturaCabecera;
}

export interface ResponseListaTRS {
  data: {
    data: {
      data: Traslados[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoTRS {
  data: {
    status: string;
    data: Traslados;
  };
}

export interface ResponseInfoEstadoTRS {
  data: {
    status: string;
    dataEstado: string;
  };
}

export interface ResponseInfoTRP {
  data: {
    status: string;
    data: Traslados;
  };
}

export interface ListaPrecios {
  precio: string;
  id: number;
  codigo: string;
  descripcion: string;
  estado: string;
  nit: string;
  created_at: Date;
  updated_at: Date;
  detalle: ProductoLP[];
}

export interface ListapreProductos {
  id: number;
  producto_id: string;
  lista_precio_id: string;
  precio: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseListaPreProductos {
  data: {
    status: string;
    data: ListapreProductos[];
  };
}

export interface ResponseListapre {
  data: ListaPrecios[];
}

export interface ResponseListapreCli {
  data: {
    data: ListaPrecios[];
    status: string;
  };
}

export interface ResponseInfoLP {
  data: {
    created_at: string | number | Date;
    status: string;
    data: ListaPrecios;
  };
}

export interface ResponseInfoDetLP {
  data: ProductoLP[];
}

export interface ResponseMedico {
  data: {
    status: string;
    data: Medico;
  };
}

export interface ResponseMedicos {
  status: string;
  data: Medico[];
}

export interface Medico {
  id: number;
  tipo_identificacion: string;
  numero_identificacion: string;
  nombre_primero: string;
  nombre_segundo: string;
  apellido_primero: string;
  apellido_segundo: string;
  entidad: string;
  estado: string;
  rural: string;
}

export interface ResponseSearchMedicos {
  data: {
    status: string;
    data: Medico;
  };
}
export interface MedicoDispensacion {
  id: number;
  tipo_identificacion: string;
  numero_identificacion: string;
  nombre_primero: string;
  nombre_segundo: string;
  apellido_primero: string;
  apellido_segundo: string;
  entidad: string;
  nombre_completo_m: string;
}

export interface Despacho {
  id: number;
  despacho: string;
  estado: string;
}

export interface ResponseDespachos {
  data: {
    status: string;
    data: Despacho[];
  };
}

export interface ConvenioTipo {
  id: number;
  producto_id: string;
  lista_precio_id: string;
  precio: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface CuotaModeradora {
  id: number;
  fecha: string;
  regimen: string;
  categoria: string;
  valor: string;
  estado: string;
  tipo_regimen: string;
}

export interface ResponseConvenio {
  data: {
    status?: string;
    data: Convenio[];
  };
}

export interface ResponseInfoConvenio {
  data: {
    data: Convenio;
    status: string;
  };
}

export interface ResponseConvenioTipo {
  data: {
    status: string;
    data: ConvenioTipo[];
  };
}

export interface ResponseCoberturaPlanBeneficios {
  data: {
    status: string;
    data: CoberturaPlanBeneficios[];
  };
}

export interface CoberturaPlanBeneficios {
  id: number;
  nombre: string;
  estado: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseTipoConsulta {
  data: {
    status: string;
    data: TipoConsulta[];
  };
}

export interface TipoConsulta {
  id: number;
  nombre: string;
  estado: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseModalidadContrato {
  data: {
    status: string;
    data: ModalidadContrato[];
  };
}

export interface ModalidadContrato {
  id: number;
  nombre: string;
  estado: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseSearchConveniosFacturacion {
  data: {
    status: string;
    data: ConveniosFacturacion[];
  };
}
export interface ResponseSearchConvenioUsuarios {
  data: {
    status: string;
    data: ConveniosFacturacion[];
  };
}

export interface ConveniosFacturacion {
  id: number;
  nit: string;
  descripcion: string;
  num_contrato: string;
  user_id: string;
  convenio_id: string;
}
export interface ResponseSearchUsuariosFacturacion {
  data: {
    status: string;
    data: UsuariosFacturacion[];
  };
}

export interface UsuariosFacturacion {
  id: number;
  nombre: string;
}

export interface ConvenioTipo {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseCuotaModeradora {
  data: {
    status: string;
    data: CuotaModeradora;
  };
}
export interface ResponseCuotaModeradoras {
  data: {
    status: string;
    data: CuotaModeradora[];
  };
}

export interface Diagnostico {
  id: number;
  codigo: string;
  descripcion: string;
  estado: string;
  created_at: string;
  updated_at: string;
  has_alert: string;
}

export interface ResponseSearchDiagnosticos {
  data: {
    data: {
      data: Diagnostico[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface Convenio {
  id: number;
  tipo_convenio: string;
  estado_conv: string;
  cuota_moderadora: string;
  nit: string;
  descripcion: string;
  valor_total: string;
  reg_conv: string;
  fec_ini: Date;
  fec_fin: Date;
  num_contrato: string;
  modalidad_contr: string;
  cobertura_pb: string;
  aut_cabecera: string;
  aut_detalle: string;
  num_caracter_det: string;
  tipo_consulta: string;
  tipo_consul: string;
  lista_pre: string;
  tipo_facturacion: string;
  id_tipo_conv: string;
  id_mod_contra: string;
  id_cober_pb: string;
  id_tipo_factu: string;
  redondeo_iva: string;
  dto_cuota: string;
  id_tipo_dispensacion: string;
  centro_costo: string;
  periodo_pago: string;
  bodegas: string;
  conceptos: string;
  cuota_mod: string;
  estado: string;
  iva: string;
  id_user: string;
  id_listapre: string;
  created_at: Date;
  updated_at: Date;
  conceptosArray: ConceptoFact[];
  tipo_consulArray: TipoCons[];
  tercero: Tercero;
  tipo_dispensacion: TipoDispensacion;
  lista_precli: ListaPrecios;
  remisiones_sum_total: string;
  nc_rvd_sum_total: string;
  etiqueta_rips: string;
}

export interface ResponseSearchConvenios {
  data: {
    status: string;
    data: Convenio[];
  };
}

export interface ResponseDiagnostico {
  data: {
    status: string;
    data: Diagnostico;
  };
}

export type ResponseDiagnosticoSearch = {
  data: {
    status: string;
    data: Diagnostico | Diagnostico[];
  };
};

export interface ResponseDiagnosticos {
  data: {
    status: string;
    data: Diagnostico[];
  };
}

export interface ListaPreCli {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseNitConvenio {
  data: {
    status: string;
    data: Tercero[];
  };
}

export interface BodxUsu {
  id: number;
  id_user: string;
  id_bodega: string;
  created_at: Date;
  updated_at: Date;
  //bodegas: Bodega[];
}

export interface ResponseBodxusu {
  data: {
    status: string;
    data: BodxUsu;
  };
}

export interface ResponsePacientes {
  data: {
    status: string;
    data: Paciente[];
  };
}

export interface ResponsePacientesPag {
  data: {
    status: string;
    data: {
      data: Paciente[];
      per_page: number;
      total: number;
    };
  };
}

export interface ResponsePaciente {
  data: {
    status: string;
    data: Paciente;
  };
}

export interface Paciente {
  id: number;
  tipo_identificacion: string;
  numero_identificacion: string;
  nombre_primero: string;
  nombre_segundo: string;
  apellido_primero: string;
  apellido_segundo: string;
  fecha_nacimiento: string;
  edad: string;
  genero: string;
  direccion: string;
  celular: string;
  eps: Entidad;
  eps_id: string;
  cuota_moderadora_id: number;
  cuotas_moderadoras: CuotaModeradora;
  estado: string;
  nombre_completo: string;
  dispensaciones_30?: IDispensacion[];
  cuotasmoderadoras: CuotaModeradora;
  pendientes_30?: IDPendiente[];
  pais_origen_id: string;
  localidad_id: string;
  pais_origen: Pais;
  localidad: Localidades;
  tipo_regimen_id: string;
  tipo_regimen: TipoRegimen;
}

export interface Eps {
  id: number;
  eps: string;
  estado_id: number;
}
export interface Entidad {
  id: number;
  entidad: string;
  estado_id: number;
}
export interface Images {
  id: number;
  consecutivo: string;
  image: string;
  estado_id: number;
}

export interface ResponseSearchPacientes {
  data: {
    status: string;
    data: Paciente;
    pendiente?: Paciente;
    alerta_autorizacion_redladera: boolean;
  };
}

export interface ResponseSearchEps {
  data: {
    status: string;
    data: Eps[];
  };
}
export interface ResponseSearchEntidad {
  data: {
    status: string;
    data: Entidad[];
  };
}
export interface ResponseSearchImages {
  data: {
    status: string;
    data: Images[];
  };
}

export interface ResponseDISxPACIENTE {
  data: {
    status: string;
    data: IDispensacion[];
  };
}

export interface IDispensacion {
  flag_pendientes: string;
  usuarios: any;
  id: number;
  autorizacion_cabecera: string;
  consecutivo: string;
  eps: string;
  despacho_id: string;
  despachos: Despacho;
  cuota_moderadora: string;
  observacion: string;
  fecha_formula: string;
  lugar_formula: string;
  numero_formula: string;
  convenio_id: string;
  convenios: Convenio;
  descripcion_convenio: string;
  tipo_documento_id: string;
  paciente_id: string;
  pacientes: Paciente;
  medico_id: string;
  medico: MedicoDispensacion;
  medicos: Medico;
  diagnostico_id: string;
  diagnostico_rel_id: string;
  concepto_id: string;
  user_id: string;
  regimen: string;
  categoria: string;
  valor: string;
  nombre_completo_m: string;
  diagnostico: string;
  id_motivo_aud: string;
  motivos_auditoria: MotivosAuditoria[];
  detalle: IDispensacionDetalle[];
  bodegas: Bodega;
  created_at: Date;
  entidad: string;
  bodega_id: string;
  conceptos: Concepto;
  diagnosticos: Diagnostico;
  diagnostico_rel: Diagnostico;
  estado_auditoria: EstadosAuditoria;
  devolucion_dis: string;
  estado: string;
  lugar_formula_info: Entidad;
  tipo_consulta: TipoCons;
  motivos: MotivosAuditoria[];
  numero_servinte: string;
  id_fuente: string;
  fuente: Fuentes;
}

export interface ResponseDispensaciones {
  data: {
    status: string;
    data: IDispensacion[];
  };
}

export interface ResponseDispensacion {
  data: {
    status: string;
    data: IDispensacion;
  };
}

export interface ResponsePaginateDis {
  data: {
    data: {
      data: IDispensacion[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponsePaginatePen {
  data: {
    data: {
      data: IDPendiente[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseSearchDispensaciones {
  data: {
    all: {
      devolucion_dis: string;
      id: React.Key;
    }[];
    data: {
      status: string;
      data: ItemSearchDispensaciones[];
      total: number;
    };
  };
}

export interface ItemSearchDispensaciones {
  apellido_primero: string;
  apellido_segundo: string;
  bod_nombre: string;
  consecutivo: string;
  devolucion_dis: string;
  dispensacion_created_at: string;
  estado: string;
  estado_auditoria: string;
  fecha_last_cargue: string;
  id: string;
  nombre_primero: string;
  nombre_segundo: string;
  numero_identificacion: string;
  tiene_imagen_documento: string;
  pendiente_id: string;
}

export interface IDispensacionDetalle {
  id: number;
  autorizacion_detalle: string;
  cantidad_solicitada: string;
  cantidad_entregada: string;
  cantidad_saldo: string;
  cantidad_dev: string;
  precio_venta: string;
  precio_subtotal: string;
  precio_iva: string;
  precio_venta_total: string;
  numero_linea: number;
  costo_unitario: string;
  costo_subtotal: string;
  costo_impuesto: string;
  costo_total: string;
  dispensacion_id: number;
  producto_lote_id: number;
  productos_lotes: ProductoLote;
  dispensacion: IDispensacion;
  dispensaciones: IDispensacion;
  created_at: string;
  dias_tratamiento: string;
  producto_id: string;
  producto: Producto;
  id_motivo_detalle: string;
}
export interface TipoCons {
  id: number;
  nombre: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseTipoCons {
  data: {
    status: string;
    data: TipoCons;
  };
}

export interface ResponseConceptos {
  data: {
    status: string;
    data: Concepto[];
  };
}

export interface ResponseParametrosAuditoria {
  data: {
    status: string;
    data: ParametrosAuditoria[];
  };
}

export interface ResponseConcepto {
  data: {
    status: string;
    data: Concepto;
  };
}
export interface ResponseParametroAuditoria {
  data: {
    status: string;
    data: ParametrosAuditoria;
  };
}

export interface ResponseConceptosFact {
  data: {
    status: string;
    data: ConceptoFact[];
  };
}

export interface ResponseConceptoFact {
  data: {
    status: string;
    data: ConceptoFact;
  };
}

export interface Concepto {
  id: number;
  nombre: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}
export interface ParametrosAuditoria {
  id: number;
  descripcion: string;
  cod_estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface ConceptoFact {
  id: number;
  descripcion: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseInfoPend {
  data: {
    status: string;
    data: IDPendiente;
  };
}

export interface ResponseListaMedicos {
  data: {
    status: string;
    data: Medico[];
  };
}

export interface ResponseListFacturacionConvenios {
  data: {
    status: string;
    data: UserConvenios[];
  };
}

export interface UserConvenios {
  key: string;
  id: number;
  nombre: string;
  descripcion: string;
}

export interface ResponsePendientes {
  data: {
    status: string;
    data: IDPendiente[];
  };
}

export interface IDPendiente {
  id: number;
  pendiente_cabecera: string;
  autorizacion_cabecera: string;
  consecutivo: string;
  eps: string;
  tipo_consulta: string;
  despacho: string;
  cuota_moderadora: string;
  observacion: string;
  fecha_formula: string;
  lugar_formula: string;
  numero_formula: string;
  convenio_id: string;
  bodega_id: string;
  entidad: string;
  estado: string;
  descripcion_convenio: string;
  tipo_documento_id: number;
  paciente_id: number;
  pacientes: Paciente;
  medico_id: number;
  medico: MedicoDispensacion;
  diagnostico_id: string;
  concepto_id: string;
  user_id: number;
  regimen: string;
  categoria: string;
  valor: number;
  nombre_completo_m: string;
  diagnostico: string;
  detalle: PendienteDetalle[];
  bodegas: Bodega;
  created_at: Date;
  dispensacion: IDispensacion;
  entidad_info: Entidad;
  conceptos: Concepto;
  medicos: Medico;
  convenios: Convenio;
  diagnosticos: Diagnostico;
  diagnostico_rel: Diagnostico;
  tipo_consulta_info: TipoCons;
  usuarios: User;
  dispensaciones_pagadas: IDispensacion[];
  diagnostico_rel_id: string;
  motivo_cancelacion: string;
  despacho_info: Despacho;
}

export interface PendienteDetalle {
  id: number;
  autorizacion_detalle: string;
  cantidad_solicitada: string;
  cantidad_entregada: string;
  cantidad_saldo: string;
  cantidad_pagada: string;
  precio_venta: string;
  precio_subtotal: string;
  precio_iva: string;
  precio_venta_total: string;
  numero_linea: number;
  estado: number;
  costo_unitario: string;
  costo_subtotal: string;
  costo_impuesto: string;
  costo_total: string;
  pendiente_id: number;
  producto_id: number;
  created_at: Date;
  updated_at: Date;
  dias_tratamiento: string;
  producto: Producto;
  productos_lotes: ProductoLote;
}

export interface ResponseLocalidad {
  data: {
    status: string;
    data: Localidades[];
  };
}
export interface Localidades {
  id: number;
  region: string;
  codigo_departamento: string;
  departamento: string;
  codigo_municipio: string;
  municipio: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponsePaises {
  data: {
    status: string;
    data: Pais[];
  };
}
export interface Pais {
  id: number;
  codigo: string;
  nombre: string;
  abreviatura1: string;
  abreviatura2: string;
  created_at: Date;
  updated_at: Date;
}

export interface IDocumentos {
  usuarios: any;
  id: number;
  consecutivo: string;
  observacion: string;
  tipo_documento_id: number;
  user_id: number;
  total: number;
  subtotal: string;
  //detalle: IDispensacionDetalle[];
  bodegas: Bodega;
  created_at: Date;
  bodega_id: number;
  estado: string;
  doc_prestamo: string;
}

export interface ResponseInfoEntrada {
  data: {
    status: string;
    data: DocumentosCabeceraEntradas;
  };
}
export interface ResponseInfoSalida {
  data: {
    status: string;
    data: DocumentosCabecera;
  };
}

export interface IDocumentosDetalle {
  id: number;
  autorizacion_detalle: string;
  cantidad_solicitada: number;
  cantidad_entregada: number;
  cantidad_saldo: number;
  cantidad_dev: number;
  precio_venta: number;
  precio_subtotal: number;
  precio_iva: number;
  precio_venta_total: number;
  numero_linea: number;
  costo_unitario: number;
  costo_subtotal: number;
  costo_impuesto: number;
  costo_total: number;
  cabecera_id: number;
  producto_lote_id: number;
  productos_lotes: ProductoLote;
  created_at: string;
  producto_id: string;
  producto: Producto;
}

export interface ResponseProPadre {
  data: {
    status: string;
    data: Producto[];
  };
}

export interface ProPadre {
  id_padre: number;
  desc_padre: string;
  cod_padre2: string;
  codigo_padre2: ProductoPadre;
}

export interface ResponseProductos2 {
  data: ProductoLote[];
  status: string;
}
export interface ResponseListaSOB {
  data: DocumentosCabecera[];
}

export interface DocumentosCabeceraEntradas {
  tercero_id: any;
  id: number;
  docu_prestamo: string;
  observacion: string;
  estado: string;
  subtotal: string;
  total: string;
  consecutivo: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  created_at: Date;
  updated_at: Date;
  detalle: Array<DocumentosDetalle[]>;
  bodega: Bodega;
  usuario: User[];
  tercero: Tercero;
  documento: TipoDocumento;
  docu_vinculado_id: string;
  motivo_id: string;
  motivos: Motivos;
  user: User;
  fecha_cierre_contable: string;
  documentos_vinculados: DocumentosCabecera[];
}

export interface DocumentosCabecera {
  tercero_id: any;
  id: number;
  docu_prestamo: string;
  observacion: string;
  estado: string;
  subtotal: string;
  total: string;
  consecutivo: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  created_at: Date;
  updated_at: Date;
  detalle: DocumentosDetalle[];
  bodega: Bodega;
  usuario: User[];
  tercero: Tercero;
  documento: TipoDocumento;
  docu_vinculado_id: string;
  motivo_id: string;
  motivos: Motivos;
  user: User;
  fecha_cierre_contable: string;
  documentos_vinculados: DocumentosCabecera[];
  documento_vinculado: DocumentosCabecera;
}

export interface DocumentosDetalle {
  id: number;
  lote: string;
  fecha_vencimiento: string;
  numero_linea: string;
  descripcion: string;
  cantidad: string;
  cantidad_retorno: string;
  cantidad_sol: string;
  cantidad_pagada: string;
  precio_promedio: string;
  produ_vinculado_id: string;
  iva: string;
  subtotal: string;
  total: string;
  producto_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  producto: Producto;
}

export interface ResponseInfoSOB {
  data: {
    status: string;
    data: DocumentosCabecera;
  };
}

export interface ResponseListaOtrDoc {
  data: {
    data: {
      data: DocumentosCabecera[];
      per_page: number;
      total: number;
    };
  };
}

export interface ResponseStatistics {
  data: {
    status: string;
    data: Statistics;
  };
}

export interface Statistics {
  productos: number;
  traslados_origen: number;
  traslados_destino: number;
  ordenes_compra: number;
  dis_pendientes: number;
  permisos: PermisosDash;
}

export interface PermisosDash {
  vencimientos: boolean;
  orden_compra: boolean;
  traslado_salida: boolean;
  traslado_pendiente: boolean;
  pendientes: boolean;
}

export interface EstadosAuditoria {
  id: number;
  estado: string;
  nombre_estado: string;
  descripcion: string;
  created_at: Date;
  updated_at: Date;
  rol_estado: string;
  rol_consulta: string;
}

export interface ResponseEstadosAUD {
  data: {
    status: string;
    data: EstadosAuditoria[];
  };
}

export interface FacturaVtaDis {
  id: number;
  consecutivo: string;
  nit: string;
  num_contrato: string;
  bod_nombre: string;
  observacion: string;
  nombre_estado: string; //EstadosAuditoria[]
  created_at: Date;
  total: string;
  numero_doc: string;
  razon_soc: string;
}
export interface ResponseListaFacturaVtaDis {
  data: {
    data: {
      per_page: number;
      total: number;
      data: FacturaVtaDis[];
      page: number;
    };
    suma: string;
  };
}

export interface FacturaFVE {
  // key: React.Key;
  id: number;
  dispensaciones_id: string;
  consecutivo_id: string;
  consecutivos: { [key: string]: string };
  estado_id: string;
  fecha_emision: Date;
  fecha_vencimiento: Date;
  fecha_facturacion: Date;
  impuesto: string;
  nit: string;
  num_contrato: string;
  numero_factura_vta: string;
  numero_fve: string;
  subtotal: string;
  total: string;
  detalle: FacturaFVEDetalle[];
  cufe: string;
  respuesta: string;
  nota?: string;
  razon_soc: string;
  bod_nombre: string;
  conveni_nit: string;
}

export interface FacturaFVECabecera {
  id: string;
  factura_tipo: string;
  numero_fve: string;
  numero_factura_vta: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  fecha_facturacion: string;
  empresa_id: string;
  convenio_id: string;
  paciente_id: string;
  dispensaciones_id: string;
  qrdata: string;
  status_code: string;
  respuesta: string;
  cufe: string;
  subtotal: string;
  impuesto: string;
  total: string;
  created_at: string;
  updated_at: string;
  estado_id: string;
  bodega_id: string;
  user_id: string;
  fecha_pago: string;
  detalle: FacturaFVEDetalle[];
  convenio: Convenio;
  bodega: Bodega;
  paciente: Paciente;
  user: User;
  nota_credito_dis: NotaCreditoFVEDisCabecera;
  cta_radicado: string;
  estado_glosa: string;
  dispensacion: IDispensacion;
  info_estado_glosa: EstadoGlosas;
  radicacion: Radicacion;
}

export interface FacturaFVEDetalle {
  id: string;
  cantidad_entregada: string;
  cod_geminus: string;
  cod_mipres: string;
  codigo_producto: string;
  cum: string;
  descripcion: string;
  fecha_vencimiento: string;
  invima: string;
  lote: string;
  numero_linea: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_venta: string;
  precio_venta_total: string;
  unidad_medida: string;
  created_at: Date;
  updated_at: Date;
  fve_dis_cabecera_id: string;
  lote_id: string;
  motivo1_id: string;
  aclaracion1: string;
  motivo2_id: string;
  aclaracion2: string;
  motivo3_id: string;
  aclaracion3: string;
  valor_glosado: string;
  valor_aceptado: string;
  valor_ratificado: string;
  valor_conciliado: string;
  nce_dis_detalle?: NotaCreditoFVEDisDetalle[];
  info_motivo: MotivosAuditoria;
  nota_id?: string;
  motivo_respuesta_id: string;
  aclaracion_respuesta: string;
  motivo2_respuesta_id: string;
  aclaracion2_respuesta: string;
  motivo3_respuesta_id: string;
  aclaracion3_respuesta: string;
}

export interface FacturaFVERvdCabecera {
  id: string;
  factura_tipo: string;
  numero_fve: string;
  numero_factura_vta: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  fecha_facturacion: string;
  bodega_id: string;
  convenio_id: string;
  tercero_id: string;
  remision_venta_directa_id: string;
  qrdata: string;
  status_code: string;
  respuesta: string;
  cufe: string;
  subtotal: string;
  impuesto: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  estado_id: string;
  user_id: string;
  fecha_pago: string;
  detalle: FacturaFVERvdDetalle[];
  convenio: Convenio;
  bodega: Bodega;
  tercero: Tercero;
  user: User;
  nota_credito_rvd: NotaCreditoFVERvdCabecera;
}

export interface FacturaFVERvdDetalle {
  id: string;
  cantidad_entregada: string;
  cod_geminus: string;
  cod_mipres: string;
  codigo_producto: string;
  cum: string;
  descripcion: string;
  fecha_vencimiento: string;
  invima: string;
  lote: string;
  numero_linea: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_venta: string;
  precio_venta_total: string;
  unidad_medida: string;
  created_at: Date;
  updated_at: Date;
  fve_rvd_cabecera_id: string;
  lote_id: string;
  ncv_rvd_detalle?: NotaCreditoFVERvdDetalle[];
}

export interface ResponseListaFacturaFVE {
  data: {
    data: {
      per_page: number;
      total: number;
      data: FacturaFVE[];
      page: number;
      status: string;
    };
  };
}

export interface ResponseEntidad {
  data: {
    status: string;
    data: Entidad[];
  };
}

export interface Entidad {
  id: number;
  entidad: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseEps {
  data: {
    status: string;
    data: Eps[];
  };
}

export interface Eps {
  id: number;
  eps: string;
  estado_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Resolucion {
  id: number;
  convenio_id: string;
  prefijo: string;
  consecutivo: string;
  resolucion: string;
  fecha_resolucion: Date;
  desde: string;
  hasta: string;
  estado_id: string;
  id_user: string;
  user: User;
  convenios: Convenio[];
  created_at: Date;
  updated_at: Date;
  username: string;
  consecutivo_nc: string;
  consecutivo_nd: string;
}
export interface ResponseResolucion {
  data: {
    data: {
      status: string;
      data: Resolucion[];
      per_page: number;
    };
  };
}

export interface ResponseResolucionList {
  data: {
    status: string;
    data: Resolucion[];
    per_page: number;
  };
}

export interface ResponseInfResolucion {
  data: {
    status: string;
    data: Resolucion;
  };
}

export interface ResponsNotasCredito {
  data: {
    per_page: number;
    total: number;
    data: NotaCreditoFVEDisCabecera[];
  };
}

export interface ResponseFacturaFVE {
  data: {
    data: {
      status: string;
      data: FacturaFVE[];
      per_page: number;
      total: number;
    };
  };
}

export interface ResponseNotasCreditoFacturaE {
  data: {
    status: string;
    data: NotasCreditoFE[];
    per_page: number;
    total: number;
  };
}

export interface NotasCreditoFE {
  bod_nombre: string;
  consecutivo: string;
  created_at: string;
  estado: string;
  id: number;
  nit: string;
  num_contrato: string;
  numero_factura_vta: string;
  total: string;
  impuesto: string;
  subtotal: string;
}

export interface DispensationSearchData {
  selectedConvenios: string[]; // Adjust the type based on what your API expects
  selectedBodegas: string[]; // Adjust the type based on what your API expects
  selectedEstados: string[];
  selectedFechas: string[];
}

export interface Motivos {
  id: number;
  descripcion: string;
}

export interface ResponseMotivosAuditoria {
  data: {
    status: string;
    data: MotivosAuditoria[];
  };
}

export interface MotivosAuditoria {
  id: number;
  codigo: string;
  motivo: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface TiposDocumentosIdentificacion {
  id: number;
  codigo: string;
  descripcion: string;
  maestra: "pacientes" | "medicos" | "terceros" | "usuarios";
}

export interface ResponseTiposDocumentosIdentificacion {
  data: {
    status: string;
    data: TiposDocumentosIdentificacion[];
  };
}

export interface ResponseTipoDocumentoIdentificacion {
  data: {
    status: string;
    data: TiposDocumentosIdentificacion;
  };
}

export interface DocumentosAuditoria {
  id: number;
  created_at: Date;
  consecutivo: string;
  total: string;
  nit: string;
  num_contrato: string;
  descripcion: string;
  bod_nombre: string;
  nombre_estado: string;
  estado_facturacion: string;
}

export interface ResponseDocumentosAuditoria {
  data: {
    per_page: number;
    total: number;
    data: DocumentosAuditoria[];
  };
}

export interface ResponseSearchEstadosAud {
  data: {
    status: string;
    data: EstadosAuditoria[];
  };
}

export interface Laboratorios {
  id: number;
  descripcion: string;
  estado_id: string;
  created_at: Date;
  updated_at: Date;
}
export interface ResponseLaboratorios {
  data: {
    status: string;
    data: Laboratorios[];
  };
}

export interface DocumentosSync {
  id: number;
  bodega_id: string;
  consecutivo: string;
  created_at: string;
  descripcion: string;
  docu_entrada: string;
  docu_prestamo: string;
  docu_salida: string;
  docu_vinculado_id: string;
  estado: string;
  fecha_cierre_contable: string;
  impuesto: string;
  motivo_id: string;
  observacion: string;
  subtotal: string;
  tercero_id: string;
  tipo_documento_id: string;
  total: string;
  updated_at: string;
  user_id: string;
  codigo_homologacion: string;
  sync: string;
  bod_nombre: string;
  nit: string;
  razon_soc: string;
  numero_fve?: string;
  nro_factura?: string;
  factura_nro?: string;
  ipoconsumo?: string;
  numero_nota_credito?: string;
  numero_factura_vta?: string;
  codigo?: string;
  numero_nota_debito?: string;
  nombre_estado?: string;
  estado_id?: string;
  status_code?: string;
}

export interface ResponseDocSync {
  data: {
    data: {
      per_page: number;
      total: number;
      data: DocumentosSync[];
      page: number;
    };
    status: string;
  };
}

export interface ResponseKardexDetallado {
  data: {
    status: string;
    data: KardexDetallado[];
    saldoAnterior: number;
  };
}

export interface KardexDetallado {
  cabecera_id: string;
  cantidad: string;
  consecutivo: string;
  f_vence: string;
  fecha: string;
  lote: string;
  prefijo_doc: string;
  tipo_movimiento: string;
}

export interface ResponseKardexConsolidado {
  data: {
    status: string;
    data: KardexConsolidado[];
    saldoAnterior: number;
  };
}

export interface KardexConsolidado {
  cabecera_id: string;
  cantidad: string;
  consecutivo: string;
  f_vence: string;
  fecha: string;
  lote: string;
  prefijo_doc: string;
  tipo_movimiento: string;
  cod_producto: string;
}

export interface ResponseDocumentoInt {
  data: {
    data: TipoDocumento[];
    status?: string;
  };
}
export interface ResponseListaND {
  data: {
    data: {
      data: NotaDebitoCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoND {
  data: {
    data: NotaDebitoCabecera;
    status?: string;
  };
}

export interface ListRadicacion {
  id: number;
  fecha_facturacion: string;
  numero_factura_vta: string;
  consecutivo: string;
  cta_radicado: string;
  descripcion: string;
  total: string;
}

export interface ResponseSearchRadicacion {
  data: {
    status: string;
    data: ListRadicacion[];
  };
}

export interface NotaDebitoCabecera {
  id: number;
  consecutivo: string;
  tipo_nota_debito: string;
  observacion: string;
  estado: string;
  estado_facturacion: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  tercero_id: string;
  cabecera_id: string;
  subtotal: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  usuario: User;
  bodega: Bodega;
  tercero: Tercero;
  paciente: Paciente;
  detalle: NotaDebidoDetalle[];
  fve_dis_cabecera: FacturaFVECabecera;
  fve_rvd_cabecera: FacturaFVERvdCabecera;
  fvc_cabecera: FacturaConceptoCabecera;
}

export interface NotaDebidoDetalle {
  id: number;
  numero_linea: string;
  concepto: string;
  cantidad: string;
  iva: string;
  precio_venta: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_total: string;
  nd_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

export interface RepConsultaDocumentos {
  BODEGA_ORIGEN: string;
  CANTIDAD_DOCUMENTO: string;
  CODIGO_DIAGNOSTICO: string;
  CODIGO_PACIENTE: string;
  CODIGO_PRODUCTO: string;
  CONSECUTIVO_DOCUMENTO: string;
  CONSECUTIVO_DOCUMENTO_ORIGEN: string;
  CREATED_AT: string;
  FECHA_DOCUMENTO: string;
  HORA_DOCUMENTO: string;
  ID_BODEGA_ORIGEN: string;
  ID_TIPO_DOCUMENTO: string;
  ID_TIPO_DOCUMENTO_ORIGEN: string;
  LOTE: string;
  NOMBRE_PRODUCTO: string;
  NOMBRE_TERCERO: string;
  NOMBRE_TIPO_DOCUMENTO: string;
  OBSERVACIONES_PRODUCTO: string;
  OBSERVACION_DOCUMENTO: string;
  PRIMER_APELLIDO: string;
  PRIMER_NOMBRE: string;
  SEGUNDO_APELLIDO: string;
  SEGUNDO_NOMBRE: string;
  TELEFONO_PACIENTE: string;
  USUARIO_ELABORO: string;
}

export interface ResponseConsultaDocumentos {
  data: {
    status: string;
    data: RepConsultaDocumentos[];
  };
}

export interface ConsultaDispensacionAud {
  id: number;
  bod_nombre: string;
  consecutivo: string;
  descripcion: string;
  impuesto: string;
  nombre_estado: string;
  subtotal: string;
  total: string;
  motivo_id: string;
  estado_id: string;
}

export interface ResponseDispensacionAud {
  data: {
    status: string;
    data: ConsultaDispensacionAud[];
  };
}
export interface ResponseListRadicacion {
  data: {
    status: string;
    data: Radicacion[];
  };
}

export interface ResponseListRadicacionPag {
  data: {
    data: {
      data: Radicacion[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseInfoRadicacion {
  data: {
    data: Radicacion;
    status?: string;
  };
}

export interface Radicacion {
  id: number;
  cta_radicado: string;
  fecha_radicado: string;
  fecha_glosa: string;
  fecha_respuesta: string;
  fecha_ratificacion: string;
  fecha_conciliacion: string;
  nro_radicado: string;
  nit: string;
  total: string;
  total_glosado: string;
  user_id: string;
  estado_id: string;
  created_at: Date;
  updated_at: Date;
  tercero: Tercero;
  users: User;
  facturas: FacturaFVECabecera[];
  items: FacturaFVEDetalle[];
}

export interface ResponseListEstadosGlosas {
  data: {
    status: string;
    data: EstadoGlosas[];
  };
}

export interface EstadoGlosas {
  id: number;
  grupo: string;
  nombre: string;
  descripcion: string;
  creaated_at: string;
  updated_at: string;
}

export interface ResponseListFacturasRadicadas {
  data: {
    data: {
      data: FacturaRadicada[];
      per_page: number;
      total: number;
    };
    all: { id: string; total: string; rad_id: string }[];
    total: number;
    status?: string;
  };
}

export interface FacturaRadicada {
  key?: React.Key;
  id: string;
  cta_radicado: string;
  nro_radicado: string;
  dispensaciones_id: string;
  factura_tipo: string;
  fecha_radicado: string;
  fecha_facturacion: string;
  numero_factura_vta: string;
  total: string;
  estado_glosa: string;
  estado_glosa_nombre: string;
  estado_glosa_grupo: string;
  grupo_glosa: string;
  nit: string;
  razon_soc: string;
  dispensaciones: IDispensacion[];
  fecha_glosa: string;
  fecha_respuesta: string;
  fecha_ratificacion: string;
  fecha_conciliacion: string;
  convenio_id: string;
}

export interface ResponseTrazabilidadFVE {
  data: {
    status: string;
    data: TrazabilidadFVE[];
  };
}

export interface TrazabilidadFVE {
  id: number;
  id_fve: string;
  estado_glosa: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  factura: FacturaFVECabecera;
  estado_glosa_info: EstadoGlosas;
  usuario: User;
}

export interface ResponseListaOficios {
  data: {
    status: string;
    data: string[];
  };
}

export interface ResponseInfoFveDis {
  data: {
    status: string;
    data: FacturaFVECabecera;
  };
}
export interface TrazabilidadDIS {
  id: number;
  user_id: string;
  id_dispensacion: string;
  estado_auditoria: string;
  estadoAuditoria: EstadosAuditoria;
  id_motivo_aud: string;
  motivo: MotivosAuditoria;
  created_at: string;
  updated_at: string;
  username: string;
  id_motivo_detalle: string;
  consecutivo: string;
  nombre_estado: string;
}
export interface ResponseTrazabilidadDIS {
  data: {
    status: string;
    data: TrazabilidadDIS[];
  };
}

export interface ResponseConvenios {
  data: {
    data: Convenio[];
    status: string;
  };
}

export interface RepConsultaDocumentos {
  BODEGA_ORIGEN: string;
  CANTIDAD_DOCUMENTO: string;
  CODIGO_DIAGNOSTICO: string;
  CODIGO_PACIENTE: string;
  CODIGO_PRODUCTO: string;
  CONSECUTIVO_DOCUMENTO: string;
  CONSECUTIVO_DOCUMENTO_ORIGEN: string;
  CREATED_AT: string;
  FECHA_DOCUMENTO: string;
  HORA_DOCUMENTO: string;
  ID_BODEGA_ORIGEN: string;
  ID_TIPO_DOCUMENTO: string;
  ID_TIPO_DOCUMENTO_ORIGEN: string;
  LOTE: string;
  NOMBRE_PRODUCTO: string;
  NOMBRE_TERCERO: string;
  NOMBRE_TIPO_DOCUMENTO: string;
  OBSERVACIONES_PRODUCTO: string;
  OBSERVACION_DOCUMENTO: string;
  PRIMER_APELLIDO: string;
  PRIMER_NOMBRE: string;
  SEGUNDO_APELLIDO: string;
  SEGUNDO_NOMBRE: string;
  TELEFONO_PACIENTE: string;
  USUARIO_ELABORO: string;
}

export interface ResponseConsultaDocumentos {
  data: {
    status: string;
    data: RepConsultaDocumentos[];
  };
}

export interface Aliado {
  id: number;
  aldo_nombre: string;
  aldo_descripcion: string;
  convenio_id: string;
  estado: string;
  convenio: Convenio;
  productos: AliadoProductos[];
}

export interface AliadoProductos {
  id: number;
  aliado_id: string;
  producto_id: string;
  codigo_aliado: string;
  producto: Producto;
  aliado: Aliado;
  tarifa: string;
}

export interface UserAliados {
  id: number;
  id_aliado: string;
  id_user: string;
  created_at: string;
  updated_at: string;
  aliado: Aliado;
}

export interface ResponseAliado {
  data: {
    status: string;
    data: Aliado;
  };
}

export interface ResponseAliados {
  data: {
    status: string;
    data: Aliado[];
  };
}

export interface ResponseUserAliado {
  data: {
    status: string;
    data: UserAliados;
  };
}

export interface ResponseAliadoListPag {
  data: {
    data: {
      data: Aliado[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ErroresPlano {
  columna: string;
  fila: number;
  message: string;
}
export interface AlertasPlano {
  columna: string;
  fila: number;
  message: string;
  producto_aliado: string;
  producto_sebthi: string;
  tarifa: number;
}

export interface ResponseDispensacionesAliadosListPag {
  data: {
    data: {
      data: DispensacionAliadoCabecera[];
      per_page: number;
      total: number;
    };
    all: { id: string }[];
    status?: string;
  };
}

export interface ResponseDispensacionAliados {
  data: {
    status: string;
    data: DispensacionAliadoCabecera;
  };
}

export interface DispensacionAliadoCabecera {
  id: number;
  aliado_id: string;
  convenio_id: string;
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
  subtotal: string;
  impuesto: string;
  total: string;
  modalidad: string;
  tipo_entrega: string;
  estado_auditoria: string;
  estado_facturacion: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  observacion_auditoria: string;
  detalle: DispensacionAliadoDetalle[];
  aliado: Aliado;
  usuario: User;
  motivo_id: string;
  files: string[];
}

export interface DispensacionAliadoDetalle {
  id: number;
  cabecera_id: string;
  autorizacion_detalle: string;
  codigo_producto: string;
  producto_id: string;
  lote: string;
  fecha_vencimiento: string;
  dias_tratamiento: string;
  cant_solicitada: string;
  cant_entregada: string;
  precio_unitario: string;
  precio_subtotal: string;
  precio_iva: string;
  precio_total: string;
  created_at: string;
  updated_at: string;
  producto: Producto;
  motivo_id: string;
}
export interface ResponseTrazabilidadDispensacionAliados {
  data: {
    status: string;
    data: TrazabilidadDispensacionAliados[];
  };
}

export interface TrazabilidadDispensacionAliados {
  id: number;
  user_id: string;
  dispensacion_id: string;
  estado: string;
  observacion: string;
  created_at: string;
  updated_at: string;
  usuario: User;
  motivo_id: string;
  motivo: MotivosAuditoria;
}

export interface Festivo {
  id: number;
  festivo_fecha: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseFestivos {
  data: {
    status: string;
    data: Festivo[];
  };
}
export interface DistribucionCabecera {
  id: number;
  nombre: string;
  consecutivo: string;
  descripcion: string;
  tipo_distribucion: string;
  bodegas: string;
  estado: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  usuario: User;
  cantidad_total: number;
  cantidad_trasladada: number;
  detalle: Array<DistribucionDetalle[]>;
}

export interface DistribucionDetalle {
  id: number;
  distribucion_id: string;
  producto_id: string;
  desc_producto: string;
  bodega_id: string;
  cantidad_distribucion: string;
  cantidad_trasladada: string;
  has_alerta: string;
  created_at: string;
  updated_at: string;
  bodega: Bodega;
  distribucion: DistribucionCabecera;
  cantidad_max: number;
  rqp_info: Rqp;
  rqp_id: string;
}

export interface ResponseDistribucionList {
  data: {
    data: {
      data: DistribucionCabecera[];
      per_page: number;
      total: number;
    };
    status?: string;
  };
}

export interface ResponseDistribucion {
  data: {
    status: string;
    data: DistribucionCabecera;
  };
}

export interface ResponseDistribucionListado {
  data: {
    status: string;
    data: DistribucionCabecera[];
  };
}

export interface AlertaDistribucion {
  bod_nombre_destino: string;
  producto_id: string;
  desc_producto: string;
  cantidad_pendiente: string;
}

export interface ResponseAlertasDistribucion {
  data: {
    status: string;
    data: AlertaDistribucion[];
  };
}

export interface ResponseDistribucionFactura {
  data: {
    status: string;
    data: ProductosDist[];
  };
}
export interface ProductosDist {
  desc_prod_distribucion: string;
  cod_producto_distribucion: string;
  detalle_dist_id: string;
  bodegas: BodegasDist[];
  lotes_disponibles: LotesDisponible[];
}

export interface BodegasDist {
  cantidad_distribucion: number;
  cantidad_trasladada: number;
  cantidad_traslado: number;
  bod_nombre_destino: string;
  bod_origen: string;
  bod_destino: string;
  cantidades: LotesDisponible[];
}

export interface LotesDisponible {
  producto_id: string;
  descripcion: string;
  lote: string;
  fecha_vencimiento: Date;
  cantidad: number;
  cantidad_traslado: number;
}

export interface ResponseGenerarTraslados {
  data: {
    data: Traslados;
    id: number;
    status: string;
  }[];
}

export interface Vencimientos {
  key: string;
  id: number;
  cod_padre: string;
  padre_descripcion: string;
  producto_descripcion: string;
  productos: Producto[];
  productos_lotes: ProductoLote[];
  bod_nombre: string;
  lotes: ProductoLote[];
  bodega_id: string;
  producto_id: string;
  Bodega_con_pendientes: string;
  Bodegas_con_dispensaciones: string;
  DiferenciaEnMeses: string;
}

export interface ResponceVenciminetos {
  data: {
    data: {
      data: Vencimientos[];
      per_page: number;
      total: number;
    };
  };
}

//EMPLEADOS
export interface ResponseEmpleado {
  data: {
    status: string;
    data: Empleado[];
  };
}
export interface Empleado {
  id: number;
  nombre_completo: string;
  cedula: string;
  bod_nombre: string;
  ciudad_expedicion: string;
  telefono: string;
  correo: string;
  fecha_nacimiento: string;
  ciudad_nacimiento: string;
  ciudad_residencia: string;
  barrio_residencia: string;
  direccion_residencia: string;
  contacto_emergencia: string;
  pensione_id: string;
  cesantia_id: string;
  eps: string;
  compensacione_id: string;
  riesgo_arl_id: string;
  arl_id: string;
  inclusiones_caja: string;
  contrato_id: string;
  contrato: string;
  convenio_id: string;
  cargo_id: string;
  salario: string;
  banco_id: string;
  numero_cuenta: string;
  sede_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  examen_medico: string;
  tipo_sangre: string;
  talla_camisa: string;
  talla_pantalon: string;
  user_id: string; // responsanble de ingreso
  estado: string;
  observacion: string;
  talla_zapatos: string;
  created_at: string;
  updated_at: string;
  estrato: string;
  especialidad_curso: string;
  num_grupo: string;
  instituto_formacion: string;
  nit_instituto_formacion: string;
  centro_formacion: string;
  ciudadEmpleado: string;
  auxilio: string;
  cargo: string;
  fecha_vacaciones: string;
  no_vacaciones_este_anio: string;
  no_entregas_dotaciones_este_anio: string;
}

export interface ResponsePension {
  data: {
    status: string;
    data: Pension[];
  };
}
export interface Pension {
  id: number;
  nombre: string;
  estado: string;
}

export interface ResponseCesantia {
  data: {
    status: string;
    data: Cesantia[];
  };
}
export interface Cesantia {
  id: number;
  nombre: string;
  estado: string;
}

export interface ResponseCajaCompensacion {
  data: {
    status: string;
    data: CajaCompensacion[];
  };
}
export interface CajaCompensacion {
  id: number;
  nombre: string;
  estado: string;
}

export interface ResponseRiesgoArl {
  data: {
    status: string;
    data: RiesgoArl[];
  };
}
export interface RiesgoArl {
  id: number;
  nombre: string;
  estado: string;
}

export interface ResponseBanco {
  data: {
    status: string;
    data: Banco[];
  };
}
export interface Banco {
  id: number;
  nombre: string;
  estado: string;
}

export interface ResponseIncapacidad {
  data: {
    status: string;
    data: Incapacidad[];
    data2: Incapacidad[];
    data3: Incapacidad[];
  };
}
export interface Incapacidad {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  observaciones: string;
  dias_incapacidad: string;
  salario: string;
  valor_diario: string;
  valor_incapacidad: string;
  valor_asumido_farmart: string;
  valor_recobrado: string;
  radicado: string;
  pagada: string;
  pagado_valor: string;
  fecha_pago: string;
  incapacidad_file: string;
  empleado_id: string;
  sexo: string;
  origen_incapacidade_id: string;
  origen: string;
  diagnostico_id: string;
  mes_inicio_incapacidad: string;
  nombre_completo: string;
  mes: string;
  año: string;
  cantidad: string;
  sede: string;
  ciudad: string;
  cedula: string;
  created_at: string;
  estado_radicado: string;
  total: string;
  bod_nombre: string;
  user_sys: string;
  diagnostico: string;
  transcrito_file: string;
  constancia_file: string;
}

export interface ResponseAusentismo {
  data: {
    status: string;
    data: Ausentismo[];
  };
}
export interface Ausentismo {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  empleado_id: string;
  nombre_completo: string;
  observacion: string;
  user_sys: string;
}

export interface ResponseProcesoDisciplinario {
  data: {
    status: string;
    data: ProcesoDisciplinario[];
  };
}
export interface ProcesoDisciplinario {
  id: number;
  empleado_id: string;
  nombre: string;
  empleado_sancione_id: string;
  sancion: string;
  observacion: string;
  created_at: string;
  usuario_sys: string;
}
export interface ResponseEstadoPreseleccion {
  data: {
    status: string;
    data: EstadoPreseleccion[];
  };
}
export interface EstadoPreseleccion {
  id: number;
  nombre: string;
  estado: string;
  created_at: string;
}

export interface ResponsePreseleccion {
  data: {
    status: string;
    data: Preseleccion[];
    appUrl: string;
  };
}
export interface Preseleccion {
  id: number;
  nombre: string;
  documento: string;
  cargo_id: string;
  cargo: string;
  convenio_id: string;
  convenio: string;
  examen_medico: string;
  estado_preseleccione_id: string;
  estado: string;
  observacion: string;
  user_id: string;
  nombre_reclutador: string;
  documentos_cargados: string;
  created_at: string;
}

export interface ResponseEmpleadoSancion {
  data: {
    status: string;
    data: EmpleadoSancion[];
  };
}
export interface EmpleadoSancion {
  id: number;
  nombre: string;
  estado: string;
  created_at: string;
}

export interface ResponseContratoLaboral {
  data: {
    status: string;
    data: ContratoLaboral[];
  };
}
export interface ContratoLaboral {
  id: number;
  nombre: string;
  estado: string;
  created_at: string;
}

export interface ResponseContratoTerminado {
  data: {
    status: string;
    data: ContratoTerminado[];
  };
}
export interface ContratoTerminado {
  id: number;
  nombre_completo: string;
  cedula: string;
  observacion: string;
  empleado_id: string;
  motivo_retiro_id: string;
  paz_y_salvo: string;
  created_at: string;
  fecha_fin: string;
  user_sys: string;
}

export interface ResponseOrigenIncapacidad {
  data: {
    status: string;
    data: OrigenIncapacidad[];
  };
}
export interface OrigenIncapacidad {
  id: number;
  nombre: string;
}

export interface ResponsePocentaje {
  data: {
    status: string;
    data: Porcentaje[];
  };
}
export interface Porcentaje {
  id: number;
  porcentaje: string;
  tipo_incapacidad: string;
  origen: string;
  estado: string;
  articulo: string;
  dias: string;
}
export interface ConsultaPendientesPaciente {
  apellido_primero: string;
  apellido_segundo: string;
  autorizacion_cabecera: string;
  bod_nombre: string;
  cantidad_saldo: string;
  cantidad_pagada: string;
  consecutivo: string;
  created_at: string;
  descripcion: string;
  id: string;
  nombre_primero: string;
  nombre_segundo: string;
  observacion: string;
  producto_id: string;
}

export interface ResponseConsultaPendientesPaciente {
  data: {
    data: ConsultaPendientesPaciente[];
    status: string;
  };
}
export interface ResponseListTipoDispensacion {
  data: {
    data: TipoDispensacion[];
    status: string;
  };
}

export interface ResponseInfoTipoDispensacion {
  data: {
    data: TipoDispensacion;
    status: string;
  };
}

export interface TipoDispensacion {
  id: number;
  descripcion: string;
  created_at: string;
  updated_at: string;
  campos: CamposxTipoDispensacion[];
}

export interface CamposxTipoDispensacion {
  id: number;
  id_campo: string;
  id_tipo_dispensacion: string;
  obligatoriedad: string;
  created_at: string;
  updated_at: string;
  campo_dispensacion: CampoDispensacion;
}

export interface CampoDispensacion {
  id: number;
  nombre: string;
  clave: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseListCamposDispensacion {
  data: {
    data: CampoDispensacion[];
    status: string;
  };
}

export interface ResponseListFuentes {
  data: {
    data: Fuentes[];
    status: string;
  };
}

export interface ResponseInfoFuente {
  data: {
    data: Fuentes;
    status: string;
  };
}

export interface Fuentes {
  id: number;
  prefijo: string;
  last_consec: string;
  descripcion: string;
  tipo_fuente: string;
  estado: string;
  created_at: string;
  updated_at: string;
  validate_duplicates: string;
}

export interface FuentesxUsuario {
  id: number;
  user_id: string;
  fuente_id: string;
  created_at: string;
  updated_at: string;
  fuente: Fuentes;
}

export interface ResponseZonasBodega {
  data: {
    data: ZonasBodega[];
    status: string;
  };
}

export interface ZonasBodega {
  zona_id: string;
  producto_id: string;
  bodega_id: string;
  descripcion: string;
  zona: string;
  cod_huv: string;
}

export interface ResponseRhConvenios {
  data: {
    status: string;
    data: RhConvenio[];
  };
}
export interface RhConvenio {
  id: number;
  nombre_convenio: string;
  numero_contrato: string;
  objeto: string;
  estado: string;
}

export interface ResponseArl {
  data: {
    status: string;
    data: Arl[];
  };
}
export interface Arl {
  id: number;
  nombre: string;
  estado: string;
}

export interface ProductoTerminadoCabecera {
  id: number;
  consecutivo: string;
  observacion: string;
  estado: string;
  tipo_documento_id: string;
  user_id: string;
  bodega_id: string;
  tercero_id: string;
  subtotal: string;
  total: string;
  created_at: Date;
  updated_at: Date;
  usuario: User;
  bodega: Bodega;
  tercero: Tercero;
  detalle: Array<ProductoTerminadoDetalle[]>;
}

export interface ProductoTerminadoDetalle {
  id: number;
  numero_linea: string;
  cantidad: string;
  iva: string;
  precio_unitario: string;
  precio_iva: string;
  precio_subtotal: string;
  precio_total: string;
  pto_id: string;
  producto_lote_id: string;
  estado: string;
  created_at: Date;
  updated_at: Date;
  pto_cabecera: ProductoTerminadoCabecera;
  lote: ProductoLote;
}

export interface ResponseIps {
  data: {
    status: string;
    data: Ips[];
  };
}
export interface Ips {
  id: number;
  nombre: string;
  direccion: string;
  localidade_id: string;
  ciudad: string;
  estado: string;
}

export interface ResponseAlertaContrato {
  data: {
    status: string;
    data: AlertaContrato[];
  };
}
export interface AlertaContrato {
  id: number;
  contrato_laborale_id: string;
  dias: string;
  descripcion: string;
  estado: string;
  nombre: string;
}

//activos

export interface Categoria {
  id: number;
  descripcion: string;
  estado: string;
}

export interface ResponseCategoria {
  data: Categoria;
  status: string;
}

export interface ResponseListaCategorias {
  data: Categoria[];
  status: string;
  total: number;
  per_page: number;
}

export interface ResponseSelectCategorias {
  data: {
    data: Categoria[];
    status: string;
  };
}

export interface SubCategoria {
  id: number;
  descripcion: string;
  id_Categoria: number;
  categoria: Categoria;
  estado: string;
}

export interface ResponseSubCategoria {
  data: {
    data: SubCategoria;
    status: string;
  };
}

export interface ResponseListSubCategorias {
  data: SubCategoria[];
  status: string;
  total: number;
  per_page: number;
}

export interface ResponseSelectSubCategorias {
  data: {
    data: SubCategoria[];
    status: string;
  };
}

export interface Parametro {
  id: number;
  descripcion: string;
  estado: string;
  tipo: "texto" | "imagen" | "pdf" | "fecha" | "numero";
}

export interface ResponseParametros {
  data: Parametro;
  status: string;
}

export interface ResponseSelectParametros {
  data: {
    data: Parametro[];
    status: string;
  };
}

export interface ResponseListParametros {
  data: Parametro[];
  status: string;
  total: number;
  per_page: number;
}

export interface Parametros_SubCategoria {
  descripcion: any;
  id: number;
  id_subcategoria: number;
  id_parametro: number;
  subcategoria: SubCategoria;
  parametro: Parametro;
  multiplesParametros: number[];
  estado: string;
}

export interface ResponseParametros_SubCategorias {
  data: Parametros_SubCategoria;
  status: string;
}

export interface ResponseListaAllParametrosxSubcategoria {
  data: Parametro[];
}

export interface ResponseListParametros_SubCategoria {
  data: Parametros_SubCategoria[];
  status: string;
  total: number;
  per_page: number;
}

export interface ResponseSelectParametros_SubCategoria {
  data: {
    data: Parametros_SubCategoria[];
    status: string;
  };
}

export interface Datos {
  id: number;
  id_activo: number;
  id_parametro_subCategoria: number;
  valor_almacenado: string;
  parametro_sub_categoria: Parametros_SubCategoria;
  activo: Activos;
  parametro: Parametro;
}

export interface ResponceDatos {
  data: Datos;
  status: string;
}

export interface ResponseListDatos {
  data: Datos[];
  status: string;
  total: number;
  per_page: number;
}

export interface ResponseSelectDatos {
  data: {
    data: Datos[];
    status: string;
  };
}

export interface DatosCrear {
  id_parametro_subCategoria: number;
  valor_almacenado: any;
}

export interface Activos {
  id: number;
  nombre: string;
  observaciones: string;
  id_usuario: string;
  localizacion: string;
  id_categoria: string;
  id_subCategoria: string;
  id_area: string;
  fecha_compra: Date;
  valor_compra: Float32Array;
  datos: Datos[];
  categoria: Categoria;
  subcategoria: SubCategoria;
  bodega_info: Bodega;
  usuarios: UserData;
  area: SubLocalizacionArea;
  estado: string;
  estado_propiedad: string;
  amortizacion: number;
  vidaUtil: number;
  cantidad: number;
  valor_total: number;
}
export interface ResponseActivos {
  data: {
    data: Activos;
    status: string;
  };
}

export interface ResponseListActivos {
  data: Activos[];
  status: string;
  total: number;
  per_page: number;
}

export interface Mantenimiento {
  id: number;
  id_activo: number;
  fecha_mantenimiento: Date;
  fecha_fin_mantenimiento: Date;
  tipo_mantenimiento: string;
  descripcion_mantenimiento: string;
  id_tercero: number;
  valor_mantenimiento: Float32Array;
  observacion_mantenimiento: string;
  id_usuario: number;
  activos: Activos;
  user_info: User;
  tercero_info: Tercero;
  estado: string;
}

export interface ResponseMantenimiento {
  data: Mantenimiento;
  status: string;
}

export interface ResponseListMantenimiento {
  data: Mantenimiento[];
  status: string;
  total: number;
  per_page: number;
}

export interface TrasladosActivos {
  id: number;
  fecha_traslado: Date;
  id_activo: number;
  bodega_origen: number;
  bodega_destino: number;
  user_origen: number;
  user_destino: number;
  estado: string;
  fecha_recibido: Date;
  descripcion: string;
  created_at: Date;
  updated_at: Date;
  activo: Activos;
  bodega_origen_info: Bodega;
  bodega_destino_info: Bodega;
  user_origen_info: UserData;
  user_destino_info: UserData;
}

export interface ResponseTransladoActivos {
  data: TrasladosActivos;
  status: string;
}

export interface ResponseListTransladosActivos {
  data: TrasladosActivos[];
  status: string;
  total: number;
  per_page: number;
}

export interface SubLocalizacionArea {
  id: number;
  descripcion: string;
  estado: string;
}

export interface ResponseSubLocalizacionArea {
  data: SubLocalizacionArea;
  status: string;
}

export interface ResponseListSubLocalizacionArea {
  data: SubLocalizacionArea[];
  status: string;
  total: number;
  per_page: number;
}

export interface SolicitarActivos {
  id: number;
  nombre_solicitud: string;
  descripcion: string;
  id_usuario: number;
  id_localizacion: number;
  id_area: number;
  id_categoria: number;
  id_subCategoria: number;
  cantidad: number;
  fecha_recibido: Date;
  estado: string;
  user_info: User;
  bodega_info: Bodega;
  categoria: Categoria;
  subcategoria: SubCategoria;
  area: SubLocalizacionArea;
}

export interface ResponseSolicitudActivos {
  data: SolicitarActivos;
  status: string;
}

export interface ResponseListSolicitudActivos {
  data: SolicitarActivos[];
  status: string;
  total: number;
  per_page: number;
}

export interface FiltrosActivos {
  categorias: number[] | null;
  subcategorias: number[] | null;
  bodegas: number[] | null;
  usuarios: number[] | null;
  area: number[] | null;
  estado: number[] | null;
  estadoPropiedad: number[] | null;
}

export interface filtrosTrasladosActivos {
  usuarioOrigen: number[] | null;
  usuarioDestino: number[] | null;
  bodegaOrigen: number[] | null;
  bodegaDestino: number[] | null;
  estado: string[] | null;
}

export interface BajaActivosFijos {
  id: number;
  id_usuario: number;
  descripcion: string;
  id_activo: number;
  motivo: string;
  empresa_donacion: string;
  empresa_chatarra: string;
  empresa_venta: string;
  precio_venta: number;
  activo: Activos;
  fecha_eliminacion: Date;
  usuarios: UserData;
  bodega_info: Bodega;
}

export interface ResponseListBajaActivosFijos {
  data: BajaActivosFijos[];
  status: string;
  total: number;
  per_page: number;
}

export interface ResponseBajaActivosFijos {
  data: BajaActivosFijos;
  status: string;
}

export interface TrazabilidadActivo {
  id: number;
  id_activo: number;
  user_id: Number;
  estado: string;
  fecha: Date;
  user_info: UserData;
  proceso: string;
}

export interface ResponseListActivoCompleto {
  data: ActivoCompleto[];
  status: string;
  total: number;
  per_page: number;
}

export interface ResponseActivoCompleto {
  data: ActivoCompleto;
  status: string;
}

export interface ActivoCompleto {
  activo: Activos;
  mantenimientos: Mantenimiento[];
  trazabilidad: TrazabilidadActivo[];
}

export interface AsignarActivos {
  id: number;
  id_activo: number;
  fecha_aceptacion: Date | null;
  id_usuario: number;
  estado: string;
  activo: Activos;
  user_info: UserData;
}

export interface ResponseListAsignarActivos {
  data: AsignarActivos[];
  status: string;
  total: number;
  per_page: number;
}

export interface ResponseAsignarActivos {
  data: AsignarActivos;
  status: string;
}

export interface RetornoActivoProovedor {
  id: number;
  id_activo: number;
  id_usuario: number;
  descripcion: string;
  tipo_retorno: string;
  empresa_proovedora: number;
  fecha_creacion: Date;
  precio: number;
  estado: string;
}

export interface ResponseListRetornoActivoProovedor {
  data: RetornoActivoProovedor[];
  status: string;
  total: number;
  per_page: number;
}

export interface responseRetornoAactivoProovedor {
  data: RetornoActivoProovedor;
  status: string;
}

export interface MantenimientoAlerta {
  id_activo: number;
  nombre_activo: string;
  fecha_mantenimiento: string;
  fecha_vencimiento: string;
  alerta: string;
}

export interface ResponseMantenimientoAlertas {
  data: {
    status: string;
    data: MantenimientoAlerta[];
  };
}

export interface SoatAlerta {
  id_activo: number;
  nombre_activo: string;
  tipo: string;
  fecha_compra: string;
  fecha_vencimiento: string;
  alerta: string;
}

export interface ImpuestoRodamientoAlerta {
  id_activo: number;
  nombre_activo: string;
  tipo: string;
  fecha_compra: string;
  fecha_vencimiento: string;
  alerta: string;
}

export interface ResponseSoatAlertas {
  data: {
    status: string;
    data: SoatAlerta[];
  };
}

export interface ResponseImpuestoRodamiento {
  data: {
    status: string;
    data: ImpuestoRodamientoAlerta[];
  };
}

export interface DepreciacionActivo {
  id_activo: number;
  valor_presente: string;
  vida_util_presente: string;
  fecha: Date;
}

export interface ResponseDepreciacion {
  data: { data: DepreciacionActivo };
}

export interface ResponseListaLocalizaciones {
  status: string; // Propiedad para el estado
  data: Bodega[]; // Array de bodegas
  total: number;
  per_page: number;
}

export interface ResponseListaUsuarios {
  status: string;
  data: User[];
  total: number;
  per_page: number;
}

export interface VariablesDinamicas {
  id: number;
  nombre: string;
  valor: string;
  estado: string;
}

export interface ResponseListaVariablesDinamicas {
  data: VariablesDinamicas[];
  status: string;
  total: number;
  per_page: number;
}

export interface ResponseVariablesDinamicas {
  data: VariablesDinamicas;
  status: string;
}

//INTERFACES DIGI TURNO
export interface Turno {
  id: number;
  nombre: number;
  hora: string;
  estado: number;
  tipo: string;
  id_turno: string;
  nombre_turno: string;
}

export interface ResponseListaTurnos {
  data: Turno[];
  status: string;
  total: number;
  per_page: number;
}

export interface ResponseTurno {
  data: Turno;
  status: string;
}
export interface ResponseOtrosis {
  data: {
    status: string;
    data: Otrosi[];
  };
}
export interface Otrosi {
  id: number;
  empleado: string;
  rh_convenio: string;
  contrato_laboral: string;
  cargo: string;
  salario: string;
  old_rh_convenio_id: string;
  old_contrato_laborale_id: string;
  old_cargo_id: string;
  old_salario: string;
  fecha_otrosi: string;
  user_created: string;
  user_updated: string;
  rh_convenio_id: string;
  contrato_laborale_id: string;
  cargo_id: string;
}
export interface ResponseOtrosi {
  data: Otrosi;
}

export interface ResponseVacaciones {
  data: {
    status: string;
    data: Vacaciones[];
    message: string;
  };
}
export interface Vacaciones {
  id: number;
  empleado_id: string;
  empleado: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_reintegro: string;
  tipo_vacaciones: string;
  user_sys: string;
  periodo: string;
  dias_vacaciones: string; 
  dias_compensados: string;
}
export interface ResponseVacacion {
  data: Vacaciones;
}
export interface EmpleadoShow {
  id: number;
  nombre_completo: string;
  cedula: string;
  ciudad_expedicion: string;
  telefono: string;
  correo: string;
  fecha_nacimiento: string;
  ciudad_nacimiento: string;
  ciudad_residencia: string;
  barrio_residencia: string;
  direccion_residencia: string;
  contacto_emergencia: string;
  pensiones: string;
  cesantias: string;
  eps: string;
  caja_compensaciones: string;
  riesgo_arl: string;
  inclusiones_caja: string;
  contrato: string;
  rh_convenio: string;
  cargo: string;
  salario: string;
  banco: string;
  numero_cuenta: string;
  sede: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo_sangre: string;
  talla_camisa: string;
  talla_pantalon: string;
  talla_zapatos: string;
  estrato: string;
  especialidad_curso: string;
  num_grupo: string;
  instituto_formacion: string;
  nit_instituto_formacion: string;
  centro_formacion: string;
  auxilio: string;
  estado: string;
  observacion: string;
}

export interface ResponseDotaciones {
  data: {
    status: string;
    data: Dotacion[];
  };
}
export interface Dotacion {
  id: number;
  tipo: string;
  talla: string;
  stock: string;
}

export interface ResponseDotacion {
  data: Dotacion;
}

export interface ResponseEntregaDotaciones {
  data: {
    status: string;
    data: EntregaDotacion[];
  };
}

export interface ResponseEntregaDotacion {
  data: EntregaDotacion;
}
export interface EntregaDotacion {
  id: number;
  cedula: string;
  nombre_completo: string;
  tipo: string;
  talla: string;
  cantidad: string;
  fecha_entrega: string;
  usuario: string;
  cargo: string;
  sede: string;
  observacion: string;
  soporte: string;
  entrega_total: string;
  empleado_id: string;
  dotacione_id: string;
  fecha_inicio: string;
  dias: string;
}

export interface ResponseTotalAlertas {
  data: {
    status: string;
    data: TotalAlertas;
  };
}
export interface TotalAlertas {
  totalVacaciones: number;
  totalPeriodosDeprueba: number;
  totalIncapacidadesSinRadicar: number;
  totalContratosPorFianalizar: number;
  totalIcapacidadesSinPagar: number;
  totalEmpleadosPorDotacion: number;
  totalPeriodoPruebaDotacion: number;
}

export interface ResponseNotasCreditoGlosaPendientes {
  data: {
    status: string;
    data: NotaCreditoFVEDisCabecera[];
  };
}

export interface ResponseDevolucionDotaciones {
  data: {
    status: string;
    data: DevolucionDotacion[];
  };
}

export interface ResponseDevolucionDotacion {
  data: DevolucionDotacion;
}
export interface DevolucionDotacion {
  id: number;
  cedula: string;
  nombre_completo: string;
  tipo: string;
  talla: string;
  cantidad: string;
  fecha_devolucion: string;
  usuario: string;
  cargo: string;
  sede: string;
  observacion: string;
  soporte: string;
  entrega_total: string;
  empleado_id: string;
  dotacione_id: string;
}

export interface ResponseEmpleadosDotaciones {
  data: {
    status: string;
    data: EmpleadoDotacion[];
  };
}

export interface ResponseEmpleadoDotacion {
  data: EmpleadoDotacion;
}
export interface EmpleadoDotacion {
  id: number;
  cedula: string;
  nombre_completo: string;
  cargo: string;
  sede: string;
  talla_camisa: string;
  talla_pantalon: string;
  talla_zapatos: string;
  fecha_inicio: string;
  dias_dotacion: string;
  fecha_fin_prueba: string;
  no_entregas_dotaciones_este_anio: string;
}
export interface VariableDinamica {
  id: number;
  nombre: string;
  valor: string;
  estado: string;
}

export interface ResponseVariableDinamica {
  data: VariableDinamica;
}

export interface FormaFarma {
  id: number;
  codigo: string;
  nombre: string;
  habilitado: string;
  tabla: string;
}

export interface ResponseResolucionFacturacion {
  data: {
    status: string;
    data: ResolucionFacturacion[];
  };
}
export interface ResolucionFacturacion {
  id: number;
  prefijo: string;
  consecutivo: string;
  resolucion: string;
  fecha_resolucion: string;
  desde: string;
  hasta: string;
  estado: string;
  dias: string;
  diferencia: string;
}

/* type de datos categorias */
export interface ResponseTkCategorias {
  data: {
    status: string;
    data: TkCategoria[];
  };
}
export interface TkCategoria {
  id: number;
  name: string;
  prefijo: string;
  user_id: number;
  estado: string;
  nombre: string;
  created_at: string;
  updated_at: string;
}


/* type de datos categorias */
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


export interface ResponseTkSubCategorias {
  data: {
    status: string;
    data: TkSubCategoria[];
  };
}

export interface TkSubCategoria {
  id: number;
  tk_categoria_id: string;
  name: string;
  user_id: string;
  estado: string;
  prioridad: string;
  proceso_id: string;
  proceso_autoriza_id: string | null;
  autorizacion: string;
  created_at: string;
  nombre_usuario: string;
  categoria_padre: string;
  updated_at: string;
  tiempo_gestion: string;
  usuarios_autorizados: string;
}

export interface ResponseTkTickts {
  data: {
    status: string;
    data: TkTicket[];
  };
}

export interface ResponseTkPerfilModerador {
  data: {
    status: string;
    data: TkPerfilModerador;
  };
}

export interface TkPerfilModerador {
  id: number;
  perfil: string;
}

export interface TkTicket {
  id: number;
  created_at: string;
  prioridad: string;
  listo: string;
  detalle: string;
  estado: string;
  numero_ticket: string;
  autorizacion: string;
  nombre_autorizador: string | null;
  respuesta_autorizacion: string | null;
  userSoluciona_id: number | null;
  categoria: string;
  subcategoria: string;
  creador_ticket: string;
  rechazo: string | null;
  fin_autorizacion: string | null;
  bodega: string;
  idLogueado: number;
  documento: number;
  proceso_id: number;
  usuarioGestiona: string | null;
  nombre_proceso: string;
  usuarioAsignado: string | null;
  Tiempovencido: string | null; //tiempo en que el ticket lleva vencido
  vencido: boolean;
  tiempo_gestion: string;
  observacion: string;
  tiempo_restante: string;
  categoria_id: string;
  subcategoria_id: string;
  usuarioCrear: string;
  farmacia: string;
}

export interface ResponseTkTicktsAutorizacion {
  data: {
    status: string;
    data: TkTicketAutorizacion[];
  };
}

export interface TkTicketAutorizacion {
  id: number;
  numero_ticket: string;
  autorizacion: string;
  detalle: string;
  created_at: string;
  estado: string;
  categoria: string;
  subcategoria: string;
  bodega: string;
  creador_ticket: string;
  fin_autorizacion: string;
  respuesta_autorizacion: string;
  documento: number;
  nombre_proceso: string;
}

export interface ResponseEstadosTickets {
  data: {
    status: string;
    calificaciones: TkCalificaciones[];
    data: EstadosTickets[];
  };
}

export interface EstadosTickets {
  id: number;
  created_at: string;
  cierre_ticket: string;
  prioridad: string;
  numero_ticket: string;
  autorizacion: string;
  detalle: string;
  respuesta_autorizacion: string;
  rechazo: string;
  calificacion_final: string;
  usuario_solicita: string;
  usuario_soluciona: string;
  categoria: string;
  subcategoria: string;
  bodega: string;
  estado: string;
  creador_ticket: string;
  documento: number;
  nombre_proceso: string;
  usuarioCrear: string;
  motivo_cancelacion: string | null;
}

export interface ResponseTkPreguntas {
  data: {
    status: string;
    data: TkPreguntas[];
  };
}

export interface TkPreguntas {
  id: number;
  key: number;
  pregunta: string;
  estado: string;
  tipo: string;
  user_id: string;
  proceso_id: number;
  created_at: string;
  nombre_crea: string;
}

export interface ResponseTkProcesos {
  data: {
    status: string;
    data: TkProcesos[];
  };
}

export interface TkProcesos {
  id: number;
  nombre_proceso: string;
  user_id: string;
  creador: string;
  created_at: string;
}

export interface ResponseTkPPreguntasDinamicas {
  data: {
    status: string;
    data: TkPPreguntasDinamicas[];
  };
}

export interface TkPPreguntasDinamicas {
  id: number;
  pregunta: string;
  subcategoria_id: string;
  categoria_id: string;
  estado: string;
  created_at: string;
  subcategoria: string;
}

export interface ResponseTkCalificaciones {
  data: {
    status: string;
    data: TkCalificaciones[];
  };
}

export interface TkCalificaciones {
  id: number;
  IdCa: number;
  calificacion: string;
  pregunta: string;
}

export interface ResponseTkUsers {
  data: {
    status: string;
    data: TkUsers[];
  };
}

export interface TkUsers {
  id: number;
  nombre: string;
}

//fin tipos tickets

export interface ResponseDocumentosAuditoriaGH {
  data: {
    status: string;
    data: DocumentosAuditoriaGH[];
  };
}
export interface DocumentosAuditoriaGH {
  id: number;
  elaborado_por: string;
  documento_elaboro: string;
  ciudad_expedicion_elab: string;
  cargo_elaboro: string;
  revisado_por: string;
  cargo_reviso: string;
  aprobado_por: string;
  cargo_aprobo: string;
  documento_reviso: string;
  ciudad_expedicion_revi: string;
  documento_apro: string;
  ciudad_expedicion_apro: string;
}

export interface TipoRegimen {
  id: number;
  codigo: string;
  nombre: string;
  habilitado: string;
}

export interface ResponseTipoRegimen {
  data: {
    status: string;
    data: TipoRegimen[];
  };
}

export interface ResponseRetirarCesantias {
  data: {
    status: string;
    data: RetirarCesantias[];
  };
}
export interface RetirarCesantias {
  id: number;
  empleado: string;
  asunto : string;
  concepto: string
  valor: string;
  consecutivo: string;
  user : string;
  created_at: string;
  empleado_id : string;
}

//horarios

export interface ResponseHorarios {
  status: string;
  data: Horarios[];
  perfil?: string;
}

export interface Horarios {
  id?: number; // Opcional si no siempre está presente
  dia: string;
  hora_inicio: string;
  hora_final: string;
  horario_id: string; // En el JSON que enviaste, se llama 'horario_id'
  usuarios_autorizados: string;
}


export interface ResponseHorariosAdicionales {
  status: string;
  data: HorariosAdicional[];
}

export interface HorariosAdicional {
  id?: number; 
  observacion: string;
  dia: string;
  fecha_inicio: string;
  fecha_final: string;
  horario_id: string; 
  usuarios_autorizados: string;
}


export interface ResponsePerfilesHorarios {
  status: string;
  data: Horarios[];
  perfil?: string;
}

export interface HorariosPerfiles {
  id?: number; // Opcional si no siempre está presente
  nombre_perfil: string;
}


//fin horarios


//marcaciones asistencias

export interface ResponseMaLink {
  data: {
    status: string;
    data: MaLink[];
  };
}

export interface MaLink {
  id: number;
  nombre: string;
  link_descarga: string;
  estado: string;
  version: string;
  created_at: string;
}



export interface ResponseMaTelefonos {
  data: {
    status: string;
    data: MaTelefonos[];
  };
}

export interface MaTelefonos {
  id: number;
  marca: string;
  activo: string;
  serial_email: string;
  bod_nombre: string;
  estado: string;
  created_at: string;
}


export interface ResponseMaRegistroMarcaciones {
  data: {
    status: string;
    data: MaRegistroMarcaiones[];
  };
}

export interface MaRegistroMarcaiones {
  id: number;
  nombre_usuario: string;
  cedula: string;
  bodega_usuario: string;
  fecha: string;
  hora: string;
  bodega_registro: string;
  tipo_marcacion: string;
}


export interface ResponseMaFarmcias {
  data: {
    status: string;
    data: MaFarmacias[];
  };
}

export interface MaFarmacias {
  id: number;
  bod_nombre: string;
  estado: string;
  direccion: string;
  created_at: string;
}

export interface ResponseUsuarioRegistrados {
  data: {
    status: string;
    data: MaUsuariosRegistrados[];
  };
}

export interface MaUsuariosRegistrados {
  id: number
  nombre_completo: string
  cedula: string
  telefono: number
  bod_nombre: string
  nombre_cargo: string
  foto: string
  foto_url: string
  created_at: string
}

//fin marcación

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
  created_at: string;
  updated_at: string;
}


/* info proyectos dashboard */
export interface ResponseInfoProyectosDash {
  data: {
    status: string;
    data: InfoProyectosDash[];
  };
}
export interface InfoProyectosDash {
  proyectosActivos: string;
  proyectosInactivos: string;
  proyectosTerminados: string;
  clientesInactivos: string;
  clientesActivos: string;
}

export interface ResponsePapeleria {
  data: {
    status: string;
    data: Papeleria[];
  };
}
export interface Papeleria {
  id: number;
  codigo_insumo: string;
  insumo_descripcion: string;
  unidad: string;
  mat_requerido: string;
  agrupacion_descripcion: string;
  nombre_tercero: string;
  prefijo: string;
  fecha_pedido: string;
  punto_envio: string;
  created_at: string;
  updated_at: string;
}

//fin papeleria




/* type de datos categorias */
export interface ResponseProveedores {
  data: {
    status: string;
    data: Proveedores[];
  };
}
export interface Proveedores {
  id: number;
  nombre: string;
  correo: string;
  estado: number;
  ciudad: string;
  telefono: string;
  created_at: string;
  updated_at: string;
}

//compras

export interface ResponsePapeleria {
  data: {
    status: string;
    data: Papeleria[];
  };
}
export interface Papeleria {
  id: number;
  codigo_insumo: string;
  insumo_descripcion: string;
  unidad: string;
  mat_requerido: string;
  agrupacion_descripcion: string;
  nombre_tercero: string;
  prefijo: string;
  fecha_pedido: string;
  punto_envio: string;
  created_at: string;
  updated_at: string;
}


/* type de datos personal */
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
  activo?: string;  //columna virtual
  updated_at: string;
  created_at_string: string;
}