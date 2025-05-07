import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  ListarRadicadosRoutes,
  RepRadicacionesRoutes,
  FestivosRoutes,
  RadicarRoutes,
  GlosasRoutes,
  RipsRoutes,
  ConsultaRipsRoutes,
  DescargaZipRoutes,
  CuvRoutes
} from "../pages";


export const RadicacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/radicar/*" element={<RadicarRoutes />} />
        <Route path="/glosas/*" element={<GlosasRoutes />} />
        <Route path="/rips/*" element={<RipsRoutes />} />
        <Route path="/listar-radicados/*" element={<ListarRadicadosRoutes />} />
        <Route path="/festivos/*" element={<FestivosRoutes />} />
        <Route path="/reportes/*" element={<RepRadicacionesRoutes />} />
        <Route path="/consultaRips/*" element={<ConsultaRipsRoutes />} />
        <Route path="/descargaZip/*" element={<DescargaZipRoutes />} />
        <Route path="/cuv/*" element={<CuvRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
