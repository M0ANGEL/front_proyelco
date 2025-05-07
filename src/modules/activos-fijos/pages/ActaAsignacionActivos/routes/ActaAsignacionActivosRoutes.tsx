import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ActaAsignacionActivo } from "../pages";

export const ActaAsignacionActivoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ActaAsignacionActivo/>} />
 
      </Route>
    </RoutesWithNotFound>
  );
};
