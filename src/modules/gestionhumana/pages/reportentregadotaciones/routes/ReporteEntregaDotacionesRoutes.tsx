import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
// import { ListIncapacidades, FormIncapacidades } from "../pages";
import { ReporteEntregaDotaciones } from "../pages";

export const ReporteEntregasDotacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ReporteEntregaDotaciones />} />
      </Route>
    </RoutesWithNotFound>
  );
};
