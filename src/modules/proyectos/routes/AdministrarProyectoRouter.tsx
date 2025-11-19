import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
} from "../pages";
import { ProyectosPages } from "../pages/ProyectosPages";
import { ProyectosRoutes } from "../pages/proyectos";
import { GestionProyectoRoutes } from "../pages/gestionProyecto";
import { GestionEncargadoObraRoutes } from "../pages/gestionEncargadoObra/routes";
import { UnidadMedidaRoutes } from "../pages/unidadMedida/routes";

export const AdministrarProyectoRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ProyectosPages />} />
        <Route path="/administrar-proyectos/*" element={<ProyectosRoutes />} />
        <Route path="/gestion-proyectos/*" element={<GestionProyectoRoutes />} />
        <Route path="/gestion-encargado-obra/*" element={<GestionEncargadoObraRoutes />} />
        <Route path="/unidad-medida/*" element={<UnidadMedidaRoutes/>} />
      </Route>
    </RoutesWithNotFound>
  );
};
