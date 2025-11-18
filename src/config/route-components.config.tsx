import { ListCategoriasActivos } from "@/modules/activos-fijos";
import { ListBodegaAreas } from "@/modules/activos-fijos/pages/bodegasAreas";
import { ListKardex } from "@/modules/activos-fijos/pages/kardexActivos";
import { ListCargos, ListUsuarios } from "@/modules/admin-usuarios";
import { ListClientes } from "@/modules/clientes";
import { ListMenu, ListModulo, ListSubmenu } from "@/modules/config-sistema";
import { ListProcesosProyecto } from "@/modules/procesosObra";
import { ListProyectos } from "@/modules/proyectos";
import { ListGestionEncargadoObra } from "@/modules/proyectos/pages/gestionEncargadoObra/pages";
import { ListGestionProyectos } from "@/modules/proyectos/pages/gestionProyecto";
import { UnidadMedida } from "@/modules/proyectos/pages/unidadMedida/pages/UnidadDeMedida";
import { ListPersonalProyelco } from "@/modules/talento-humano";
import React from "react";

// ✅ IMPORTACIONES REALES de tus componentes

// ❌ ELIMINA estos componentes de ejemplo:
// const Empresas = () => (<div>...</div>);
// const Perfiles = () => (<div>...</div>);
// const Usuarios = () => (<div>...</div>);
// const Proyectos = () => (<div>...</div>);
// const Clientes = () => (<div>...</div>);
// const Configuracion = () => (<div>...</div>);

// Mapeo de keys de rutas a componentes
export const ROUTE_COMPONENTS: { [key: string]: React.ComponentType } = {
  // Gestión de Empresas
  "gestiondeempresas/empresas": () => (
    <div style={{ width: "100%", height: "100%", padding: "20px" }}>
      <h1>Componente de Empresas</h1>
      <p>Este componente se renderiza completamente en su espacio asignado</p>
    </div>
  ),

  // Administración de Usuarios
  "administraciondeusuarios/perfiles": () => (
    <div style={{ width: "100%", height: "100%", padding: "20px" }}>
      <h1>Componente de Perfiles</h1>
      <p>Este componente se renderiza completamente en su espacio asignado</p>
    </div>
  ),

  // ✅ CLIENTES REAL - Reemplazado con tu componente real
  "clientes/administrar-clientes": ListClientes,

  // ✅ USUARIOS REAL - Reemplazado con tu componente real
  "administraciondeusuarios/usuarios": ListUsuarios,

  // El resto MANTÉN igual...
  "administraciondeusuarios/cargos": ListCargos,

  // Configuración del Sistema
  "configuraciondelsistema/menus": ListMenu,

  "configuraciondelsistema/submenus": ListSubmenu,
  "configuraciondelsistema/modulos": ListModulo,

  // Proyectos
  "proyectos/administrar-proyectos": ListProyectos,
  "proyectos/gestion-proyectos": ListGestionProyectos,
  "proyectos/unidad-medida": UnidadMedida,
  "proyectos/gestion-encargado-obra": ListGestionEncargadoObra,

  // Configuración Proyectos
  "configuracionproyectos/administracion-procesos-proyectos":
    ListProcesosProyecto,

  // Compras
  "compras/admin-proveedores": () => (
    <div style={{ width: "100%", height: "100%", padding: "20px" }}>
      <h1>Componente de Proveedores</h1>
      <p>Contenido completo del componente</p>
    </div>
  ),
  "compras/administrar-cotizaciones": () => (
    <div style={{ width: "100%", height: "100%", padding: "20px" }}>
      <h1>Componente de Cotizaciones</h1>
      <p>Contenido completo del componente</p>
    </div>
  ),
  "compras/historial-cotizaciones": () => (
    <div style={{ width: "100%", height: "100%", padding: "20px" }}>
      <h1>Componente de Historial Cotizaciones</h1>
      <p>Contenido completo del componente</p>
    </div>
  ),

  // Talento Humano
  "talentohumano/administrar-personal": ListPersonalProyelco,
  "talentohumano/reporte-asistencias-th": () => (
    <div style={{ width: "100%", height: "100%", padding: "20px" }}>
      <h1>Componente de Reportes de Asistencias</h1>
      <p>Contenido completo del componente</p>
    </div>
  ),

  // Activos Fijos
  "activosfijos/parametrizacion/categorias": ListCategoriasActivos,
  "activosfijos/parametrizacion/subcategorias": () => (
    <div style={{ width: "100%", height: "100%", padding: "20px" }}>
      <h1>Componente de Subcategorias</h1>
      <p>Contenido completo del componente</p>
    </div>
  ),
  "activosfijos/parametrizacion/bodegas-areas": ListBodegaAreas,
  "activosfijos/administras-activos": () => (
    <div style={{ width: "100%", height: "100%", padding: "20px" }}>
      <h1>Componente de Administras Activos</h1>
      <p>Contenido completo del componente</p>
    </div>
  ),
  "activosfijos/historial-activos": ListKardex,
  "activosfijos/traslados-activos": () => (
    <div style={{ width: "100%", height: "100%", padding: "20px" }}>
      <h1>Componente de Traslados Activos</h1>
      <p>Contenido completo del componente</p>
    </div>
  ),
};

// Componente por defecto
export const DefaultComponent = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      padding: "20px",
      textAlign: "center",
      color: "#999",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <h3>Componente no encontrado</h3>
    <p>El componente para esta ruta no está configurado</p>
  </div>
);

// Función para obtener el componente por key
export const getRouteComponent = (key: string): React.ComponentType => {
  const cleanKey = key.replace(/^\//, "");
  return ROUTE_COMPONENTS[cleanKey] || DefaultComponent;
};
