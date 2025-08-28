import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormGestionProyectos } from "../pages/FormGestionPoryecto";
import { ListGestioNueva } from "../pages";
import { ResumenTorresING, VistaProcesoProyectosING } from "../pages/components/VistaProcesoIng";

export const GestionProyectoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListGestioNueva />} />
        <Route path="/:id" element={<FormGestionProyectos />} />
        <Route path="/proceso/:id" element={<ResumenTorresING />} />
        <Route path="/proceso/:id/detalle" element={<VistaProcesoProyectosING />} />
      </Route>
    </RoutesWithNotFound>
  );
};
