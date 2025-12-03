import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ShowSolicitudeMaterial, SolicitudeMaterial } from "../pages";


export const SolicitudMaterialRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<SolicitudeMaterial />} />
        <Route path="/showSolicitudeMaterial-ing/:codigo_proyecto" element={<ShowSolicitudeMaterial />} />
      </Route>
    </RoutesWithNotFound>
  );
};
