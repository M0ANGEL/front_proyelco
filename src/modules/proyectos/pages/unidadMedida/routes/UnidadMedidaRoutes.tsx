import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { UnidadMedida } from "../pages/UnidadDeMedida";


export const UnidadMedidaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<UnidadMedida />} />
      </Route>
    </RoutesWithNotFound>
  );
};
