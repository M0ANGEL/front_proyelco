import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormReportesRetiros } from "../pages";

export const ReporteRetirosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<FormReportesRetiros />} />
        {/* <Route path="/create" element={<FormIncapacidades />} />
        <Route path="/edit/:id" element={<FormIncapacidades />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
