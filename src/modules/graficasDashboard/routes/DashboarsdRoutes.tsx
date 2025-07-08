import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { DashboarsdPage } from "../pages/DashboarsdPage";
import { DashboardProyectos } from "../pages/proyectos";


export const DashboarsdRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<DashboarsdPage />} />
        <Route path="/dashboards-proyectos/*" element={<DashboardProyectos />} />
        {/* <Route path="/asistencias-obra/*" element={<AsistenciasObraRoutes />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
