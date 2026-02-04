import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { CalidadPages } from "../pages/CalidadPages";
import { ReporteNcRoutes } from "../pages/reporteNc";




export const CalidadRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<CalidadPages />} />
        <Route path="/reporte-material-nc/*" element={<ReporteNcRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
