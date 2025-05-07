import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { DocumentosPage, EntradasRoutes, VentasRoutes, TrasladosRoutes, SalidasRoutes } from "../pages";

export const DocumentosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<DocumentosPage />} />
        <Route path="/entradas/*" element={<EntradasRoutes />} />
        <Route path="/ventas/*" element={<VentasRoutes />} />
        <Route path="/traslados/*" element={<TrasladosRoutes />} />
        <Route path="/salidas/*" element={<SalidasRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
