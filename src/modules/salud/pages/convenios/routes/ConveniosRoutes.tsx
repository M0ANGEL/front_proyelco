import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListConvenios, FormConvenios } from "../pages";
import { ResumenManzanas, VistaProcesoProyectos } from "../components";
import { ResumenTorres } from "../components/VistaProceso";
import { VistaProcesoCasa } from "../components/Casas";

export const ConveniosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListConvenios />} />
        <Route path="/create" element={<FormConvenios />} />
        <Route path="/edit/:id" element={<FormConvenios />} />
        <Route path="/edit-casa/:id" element={<FormConvenios />} />
        <Route path="/proceso/:id" element={<ResumenTorres />} />
        <Route path="/proceso/:id/detalle" element={<VistaProcesoProyectos />} />
        <Route path="/proceso-casa/:id" element={<ResumenManzanas />} />
        <Route path="/proceso-casa/:id/detalle" element={<VistaProcesoCasa />} />
      </Route>
    </RoutesWithNotFound>
  );
};
