import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { PersonaProyelcolRoutes, TalentoHumanoPages } from "../pages";
import { SSTAdminRoutes } from "../pages/SST";
import { ReporteAsistenciaTH } from "../pages/reporteAsistencia";
import { PermisosAsistencia } from "../pages/permisosAsistencia";


export const TalentoHumanoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<TalentoHumanoPages />} />
        <Route path="/administrar-personal/*" element={<PersonaProyelcolRoutes />} />
        <Route path="/reporte-asistencias-th" element={<ReporteAsistenciaTH />} />
        <Route path="/seguridad-salud/*" element={<SSTAdminRoutes />} />
        <Route path="/permisos-asistencias" element={<PermisosAsistencia />} />
      </Route>
    </RoutesWithNotFound>
  );
};
