const HOST = import.meta.env.VITE_API_HOST;
const HOST_REP = import.meta.env.VITE_API_HOST_REP;
const HOST_GESTION = import.meta.env.VITE_API_HOST_GESTION;
const HOST_TK = import.meta.env.VITE_API_HOST_TK;
const HOST_SINCO = import.meta.env.VITE_API_HOST_SINCO;
export const BASE_URL_TK = HOST_TK + "api/"; /* tk = tickets */
const HOST_MARCACION = import.meta.env.VITE_API_HOST_MARCACION;
export const BASE_URL = HOST + "api/";
export const BASE_SICO = HOST_SINCO + "api/";
export const BASE_URL_IMAGENES = HOST;
export const BASE_URL_GESTION = HOST_GESTION + "api/"
export const BASE_URL_REP = HOST_REP + "reportes/";
export const FILES_URL = HOST + "storage/";
export const ADJUNTOS_URL = HOST + "storage/images/";
export const API_KEY = "37127b80-d847-4394-bfb1-75227fdbe5a7";
export const KEY_EMPRESA = "i_eMb71jA";
export const KEY_BODEGA = "i_bo7lH0tA";
export const KEY_ROL = "xvhur_uor";
export const KEY_USER = "userData";
// Llaves para almacenar la informacion de los select en el formulario de Dispensacion
export const KEY_CUOTAS_DIS = "xvhKONVJHVz_DIS";
export const KEY_ENTIDADES_DIS = "vghKVWBKTVS_DIS";
export const KEY_CONVENIOS_DIS = "xghDBOKVHSQ_DIS";
export const KEY_DESPACHOS_DIS = "vghDESPVCHpS_DIS";
export const CONVENIOS_DIS = "DBOKVHSQ_DIS";
// Llaves para almacenar la informacion de modal de pacientes de Dispensacion
export const KEY_CUOTAS_PAC = "xvhCOVJHVz_PAC";
export const KEY_TIPO_DOCUMENTO_PAC = "vghTDPVKBVS_PAC";
export const KEY_PAISES_PAC = "xghPKBHVHSQ_PAC";
export const KEY_LOCALIDADES_PAC = "vghLOCPVCHpS_PAC";
export const KEY_REGIMENES_PAC = "vghREGASDEo3_PAC";
// Llaves para almacenar la informacion de modal de estados y detalle en dispensaciones aliadas
export const KEY_MOTIVOS_AUDITORIA = "7WJtD4m&B3@%(k^Q)yO";
// Llaves para almacenar la informacion del formulario de glosas
export const KEY_ESTADOS_GLOSAS = "vql+7QOA)$G6HY_4dkL";
export const KEY_FESTIVOS = "nM%6t*TKZ!P";

//llaves para proyecto activos
const HOST_ACTIVOS = import.meta.env.VITE_API_HOST_ACTIVOS;
export const BASE_URL_ACTIVOS = HOST_ACTIVOS + "api/";
export const FILES_ACTIVOS_URL = HOST_ACTIVOS + "storage/";

//llaves para digi turno
const HOST_DIGITURNO = import.meta.env.VITE_API_HOST_TURNODIGITAL;
export const BASE_URL_DIGITURNO = HOST_DIGITURNO + "api/";


//marcacio
export const BASE_URL_ASISTENCIA = HOST_MARCACION + "api/"; /* tk = tickets */

