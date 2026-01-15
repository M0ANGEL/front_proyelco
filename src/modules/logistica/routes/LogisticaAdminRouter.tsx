import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { LogisticaPages } from "../pages";
import { SolicitudesRoutes } from "../pages/Solicitudes/routes";
import { RecepcionMaterialRoutes } from "../pages/recepcionMaterialAdmin/routes/RecepcionMaterialRoutes";
import { RecepcionMaterialAsignadoRoutes } from "../pages/recepcionMaterialAsignado/routes";


export const LogisticaAdminRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<LogisticaPages />} />
        <Route path="/solicitudes-logistica/*" element={<SolicitudesRoutes />} />
        <Route path="/material-admin/*" element={<RecepcionMaterialRoutes />} />
        <Route path="/material-asignado/*" element={<RecepcionMaterialAsignadoRoutes />} />

      </Route>
    </RoutesWithNotFound>
  );
};
