import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  TiposDispensacionRoutes,
  TiposDocumentosRoutes,
  ConfigSisPage,
  SubmenuRoutes,
  ModuloRoutes,
  MenuRoutes,
  ConfiguracionRoutes,
} from "../pages";
import { HorariosRoutes } from "../pages/horas_sistema";
import { HorariosTemporalesRoutes } from "../pages/horas_sistema_temporales/routes/HorariosTemporalesRoutes";
import { ReporteLogHorariosRouter } from "../pages/reporteHorarios";

export const ConfigSisRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ConfigSisPage />} />
        <Route path="/modulos/*" element={<ModuloRoutes />} />
        <Route path="/menus/*" element={<MenuRoutes />} />
        <Route path="/submenus/*" element={<SubmenuRoutes />} />
        <Route path="/tiposdocumentos/*" element={<TiposDocumentosRoutes />} />
        <Route path="/horario-sistemas/*" element={<HorariosRoutes />} /> 
        <Route path="/horario-sistemas-adicionales/*" element={<HorariosTemporalesRoutes />} />
        <Route path="/log-horarios/*" element={<ReporteLogHorariosRouter />} />
        <Route
          path="/tiposdispensacion/*"
          element={<TiposDispensacionRoutes />}
        />
        <Route
          path="/configuracion/*"
          element={<ConfiguracionRoutes />}
        />
      </Route>
    </RoutesWithNotFound>
  );
};
