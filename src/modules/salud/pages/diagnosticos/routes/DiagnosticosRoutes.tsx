import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormDiagnosticos, ListDiagnosticos } from "../pages";

export const DiagnosticosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDiagnosticos />} />
        <Route path="/create" element={<FormDiagnosticos />} />
        <Route path="/edit/:id" element={<FormDiagnosticos />} />
        <Route path="/show/:id" element={<FormDiagnosticos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
