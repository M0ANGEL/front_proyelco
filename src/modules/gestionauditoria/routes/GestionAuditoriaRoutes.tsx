import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  AudObservacionesRoutes,
  DocumentosRoutes,
  AuditoriaRoutes,
  AuditoriaPage,
  MotivosRoutes,
} from "../pages";

export const GestionAuditoriaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<AuditoriaPage />} />
        <Route path="/auditar/*" element={<AuditoriaRoutes />} />
        <Route path="/motivos/*" element={<MotivosRoutes />} />
        <Route path="/documentos/*" element={<DocumentosRoutes />} />
        <Route path="/aud-observaciones/*" element={<AudObservacionesRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
