import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ProcesosProyectoRoutes } from "../pages/administrarProcesos";
import { ProcesosProyectoPage } from "../pages";




export const AdministrarProcesosProyectoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ProcesosProyectoPage />} />
        <Route path="/administracion-procesos-proyectos/*" element={<ProcesosProyectoRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
