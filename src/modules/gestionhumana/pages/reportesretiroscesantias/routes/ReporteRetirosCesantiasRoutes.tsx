import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormReporteRetirosCesantias } from "../pages";

export const ReporteRetirosCesantiasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<FormReporteRetirosCesantias />} />
        {/* <Route path="/create" element={<FormIncapacidades />} />
        <Route path="/edit/:id" element={<FormIncapacidades />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
