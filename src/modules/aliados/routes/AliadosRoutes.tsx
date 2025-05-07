import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { AliadosPage, CarguePlanosRoutes, ListaDispensacionesRoutes, MaestraRoutes } from "../pages";

export const AliadosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<AliadosPage />} />
        <Route path="/cargue-planos/*" element={<CarguePlanosRoutes />} />
        <Route path="/maestra/*" element={<MaestraRoutes />} />
        <Route path="/listado/*" element={<ListaDispensacionesRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
