import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  ConceptosRoutes,
  FacturacionEPage,
  FacturacionRoutes,
  FacturacionFVERoutes,
  ResolucionRoutes,
  ConsultaRoutes,
  FacturacionNotasRoutes,
  FacturacionConveniosRoutes,
  ListCuotaRoutes,
} from "../pages";

export const FacturacionERoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<FacturacionEPage />} />
        <Route path="/facturacion/*" element={<FacturacionRoutes />} />
        <Route path="/conceptos-fac/*" element={<ConceptosRoutes />} />
        <Route path="/facturacionFVE/*" element={<FacturacionFVERoutes />} />
        <Route path="/resolucion/*" element={<ResolucionRoutes />} />
        <Route path="/consulta/*" element={<ConsultaRoutes />} />
        <Route path="/facturacionNotasCredito/*" element={<FacturacionNotasRoutes />} />
        <Route path="/FacturacionConvenios/*" element={<FacturacionConveniosRoutes />} />
        <Route path="/cuotaModeradoras/*" element={<ListCuotaRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
