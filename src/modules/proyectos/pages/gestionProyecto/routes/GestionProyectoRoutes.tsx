import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormGestionProyectos } from "../pages/FormGestionPoryecto";
import { ListGestioNueva } from "../pages";
import {
  ResumenTorresING,
  VistaProcesoProyectosING,
} from "../pages/components/VistaProcesoIng";
import {
  ResumenManzanasIng,
  VistaProcesoCasaIng,
} from "../pages/components/CasasIng";

export const GestionProyectoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListGestioNueva />} />
        <Route path="/:id" element={<FormGestionProyectos />} />
        <Route path="/proceso/:id" element={<ResumenTorresING />} />
        <Route
          path="/proceso/:id/detalle"
          element={<VistaProcesoProyectosING />}
        />
        <Route path="/proceso-casa/:id" element={<ResumenManzanasIng />} />
        <Route
          path="/proceso-casa/:id/detalle"
          element={<VistaProcesoCasaIng />}
        />
      </Route>
    </RoutesWithNotFound>
  );
};
