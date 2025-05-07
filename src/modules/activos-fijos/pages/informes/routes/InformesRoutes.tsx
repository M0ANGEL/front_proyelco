import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormInformesActivos, FormInformesTraslados } from "../pages";

export const InformesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="informes-activos" element={<FormInformesActivos />} />
        <Route path="informes-traslados" element={<FormInformesTraslados />} />


        
      </Route>
    </RoutesWithNotFound>
  );
};
