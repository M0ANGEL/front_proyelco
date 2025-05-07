import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListEntregaDotaciones, FormEntregaDotaciones, FormEditEntregaDotaciones, FormDevolucionDotacion } from "../pages";

export const EntregaDotacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListEntregaDotaciones />} />
        <Route path="/create" element={<FormEntregaDotaciones />} />
        <Route path="/create/:id" element={<FormEntregaDotaciones />} />
        <Route path="/edit/:id" element={<FormEditEntregaDotaciones />} />
        <Route path="/devolucion/:id" element={<FormDevolucionDotacion />} />
      </Route>
    </RoutesWithNotFound>
  );
};
