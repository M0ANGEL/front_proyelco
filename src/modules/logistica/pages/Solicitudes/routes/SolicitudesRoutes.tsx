import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListCargaPdf } from "../cargaPDF/pages/ListCargaPdf";
import { SolicitudesAgrupadasSInco } from "../solicitudesAgrupadas";


export const SolicitudesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/cargue-pdf" element={<ListCargaPdf />} />
        <Route path="/consulta-solicitudes-agrupadas" element={<SolicitudesAgrupadasSInco />} />

      </Route>
    </RoutesWithNotFound>
  );
};
