import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  ConveniosRoutes,
  SaludPage,
} from "../pages";
import { GestionProyectoRoutes } from "../pages/gestionProyecto/routes";
import { GestionEncargadoObraRoutes } from "../pages/gestionEncargadoObra/routes";
import { UnidadMedidaRoutes } from "../pages/unidadMedida/routes";

export const SaludRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<SaludPage />} />
        <Route path="/administrar-proyectos/*" element={<ConveniosRoutes />} />
        <Route path="/gestion-proyectos/*" element={<GestionProyectoRoutes />} />
        <Route path="/gestion-encargado-obra/*" element={<GestionEncargadoObraRoutes />} />
        <Route path="/unidad-medida/*" element={<UnidadMedidaRoutes/>} />
      </Route>
    </RoutesWithNotFound>
  );
};
