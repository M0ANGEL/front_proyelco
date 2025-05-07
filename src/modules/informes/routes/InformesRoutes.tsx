import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  RepComprasRoutes,
  RepDispensacionRoutes,
  RepTrasladosRoutes,
  RepOtrosRoutes,
  InformesPage,
  RepFacturacionRoutes,
  RepInventariosRoutes,
  RepAnuladosRoutes
} from "../pages";

export const InformesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<InformesPage />} />
        <Route path="/compras/*" element={<RepComprasRoutes />} />
        <Route path="/dispensacion/*" element={<RepDispensacionRoutes />} />
        <Route path="/traslados/*" element={<RepTrasladosRoutes />} />
        <Route path="/otros-documentos/*" element={<RepOtrosRoutes />} />
        <Route path="/facturacion/*" element={<RepFacturacionRoutes/>} />
        <Route path="/inventarios/*" element={<RepInventariosRoutes/>} />
        <Route path="/anulados/*" element={<RepAnuladosRoutes/>} />
      </Route>
    </RoutesWithNotFound>
  );
};
