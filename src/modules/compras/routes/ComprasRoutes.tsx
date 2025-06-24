import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ComprasPages, ProveedoresRoutes } from "../pages";
import { CarguePapeleria } from "../pages/carguePlanoPapeleria";
import { HistoricoPapeleria } from "../pages/carguePlanoPapeleria/historico/HistoricoPapeleria";




export const ComprasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ComprasPages />} />
        <Route path="/admin-proveedores/*" element={<ProveedoresRoutes />} />
        <Route path="/administrar-cotizaciones/*" element={<CarguePapeleria />} />
        <Route path="/historial-cotizaciones/*" element={<HistoricoPapeleria />} />
      </Route>
    </RoutesWithNotFound>
  );
};


