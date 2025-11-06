import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ContabilidadPages } from "../pages";
import { ControlGasolinaRoutes } from "../pages/controlGasolina/routes";




export const ContabilidadRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ContabilidadPages />} />
        <Route path="/control-gasolina" element={<ControlGasolinaRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
