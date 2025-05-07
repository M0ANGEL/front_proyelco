import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormSolicitarActivos, ListSolicitudesPendientesActivos} from "../pages";
import { ListSolicitarActivos } from "../pages/ListSolicitarActivos";



export const SolicitarActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListSolicitarActivos />} />
        <Route path="crear-solicitar-activos" element={<FormSolicitarActivos/>} />
        <Route path="solicitudes-activos" element={<ListSolicitudesPendientesActivos/>} />




      </Route>
    </RoutesWithNotFound>
  );
};
