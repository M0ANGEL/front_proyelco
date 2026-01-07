import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";


import { InformePoryectosPowerbi } from "./InformePoryectosPowerbi";
import { InformesPowerBIRoutes } from "./administrarRutasPowerBi";

export const InformePowerBiRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/informes-poryectos-power-bi" element={<InformePoryectosPowerbi />} />
        <Route path="/informe-contratos-power-bi" element={<InformePoryectosPowerbi/>} />
        <Route path="/informe-material-power-bi" element={<InformePoryectosPowerbi/>} />
        <Route path="/administrar-rutas-powerBi/*" element={<InformesPowerBIRoutes/>} />
        <Route path="/informe-logistica-power-bi/*" element={<InformePoryectosPowerbi/>} />
      </Route>
    </RoutesWithNotFound>
  );
};
