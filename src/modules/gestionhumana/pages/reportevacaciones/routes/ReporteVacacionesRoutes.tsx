import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormReporteVacaciones } from "../pages";

export const ReporteVacacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<FormReporteVacaciones />} />
        {/* <Route path="/create" element={<FormIncapacidades />} />
        <Route path="/edit/:id" element={<FormIncapacidades />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
