import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  AuditoriaPage,
  InventarioRoutes
} from "../pages";
import { SeguimientoRoute } from "../pages/seguimiento/routes";

export const VencimientoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<AuditoriaPage />} />
        <Route path="/vencimientos/*" element={<InventarioRoutes />} />
        <Route path="/seguimiento/*" element={<SeguimientoRoute />} />

      </Route>
    </RoutesWithNotFound>
  );
};
