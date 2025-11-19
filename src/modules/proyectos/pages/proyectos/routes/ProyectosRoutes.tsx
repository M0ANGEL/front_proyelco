import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ResumenManzanas, VistaProcesoProyectos } from "../components";
import { ResumenTorres } from "../components/VistaProceso";
import { VistaProcesoCasa } from "../components/Casas";
import { ListProyectos } from "../pages/ListProyectos/ListProyectos";
import { FormProyectos } from "../pages/FormProyectos";

export const ProyectosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListProyectos />} />
        <Route path="/create" element={<FormProyectos />} />
        <Route path="/edit/:id" element={<FormProyectos />} />
        {/* <Route path="/edit-casa/:id" element={<ModuloNoDisponilble />} /> */}
        <Route path="/proceso/:id" element={<ResumenTorres />} />
        <Route path="/proceso/:id/detalle" element={<VistaProcesoProyectos />} />
        <Route path="/proceso-casa/:id" element={<ResumenManzanas />} />
        <Route path="/proceso-casa/:id/detalle" element={<VistaProcesoCasa />} />
      </Route>
    </RoutesWithNotFound>
  );
};
