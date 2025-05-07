import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  ConceptosRoutes,
  ConveniosRoutes,
  CuotasModeradorasRoutes,
  DiagnosticosRoutes,
  EntidadesRoutes,
  MedicosRoutes,
  PacientesRoutes,
  SaludPage,
} from "../pages";

export const SaludRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<SaludPage />} />
        <Route path="/convenios/*" element={<ConveniosRoutes />} />
        <Route path="/medicos/*" element={<MedicosRoutes />} />
        <Route
          path="/cuotasmoderadoras/*"
          element={<CuotasModeradorasRoutes />}
        />
        <Route path="/diagnosticos/*" element={<DiagnosticosRoutes />} />
        <Route path="/pacientes/*" element={<PacientesRoutes />} />
        <Route path="/conceptos/*" element={<ConceptosRoutes />} />
        <Route path="/entidades/*" element={<EntidadesRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
