import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  MaestroZonasRoutes,
  InformeCorteRoutes,
  InventarioRoutes,
  InventarioPage,
} from "../pages";

export const GestionInventarioRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<InventarioPage />} />
        <Route path="/listar-inventario/*" element={<InventarioRoutes />} />
        <Route path="/informe-corte/*" element={<InformeCorteRoutes />} />
        <Route path="/maestro-zonas/*" element={<MaestroZonasRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
