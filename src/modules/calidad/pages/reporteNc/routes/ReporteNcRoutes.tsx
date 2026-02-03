import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";




export const ReporteNcRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        {/* <Route path="/reporte-material-nc/*" element={<ClientesRoutes />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
