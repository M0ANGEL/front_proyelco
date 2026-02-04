import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListReporteNc } from "../pages/ListReporteNc";
import { FromReporteNc } from "../pages";




export const ReporteNcRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListReporteNc />} />
        <Route path="/create" element={<FromReporteNc />} />
        <Route path="/edit/:id" element={<FromReporteNc />} />
      </Route>
    </RoutesWithNotFound>
  );
};
