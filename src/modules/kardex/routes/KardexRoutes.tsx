import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  KardexDetalladoRoutes,
  KardexConsolidadoRoutes,
  KardexPage,
} from "../pages";

export const KardexRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<KardexPage />} />
        <Route path="/detallado/*" element={<KardexDetalladoRoutes />} />
        <Route path="/consolidado/*" element={<KardexConsolidadoRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
