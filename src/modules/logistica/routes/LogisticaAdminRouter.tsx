import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { LogisticaPages } from "../pages";
import { SolicitudesRoutes } from "../pages/Solicitudes/routes";


export const LogisticaAdminRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<LogisticaPages />} />
        <Route path="/solicitudes-logistica/*" element={<SolicitudesRoutes />} />

      </Route>
    </RoutesWithNotFound>
  );
};
