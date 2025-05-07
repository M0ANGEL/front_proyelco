import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListEmpleadosDotaciones, FormEmpleadosDotaciones } from "../pages";

export const EmpleadosDotacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListEmpleadosDotaciones />} />
        {/* <Route path="/create" element={<FormEntregaDotaciones />} /> */}
        <Route path="/edit/:id" element={<FormEmpleadosDotaciones />} />
        {/* <Route path="/devolucion/:id" element={<FormDevolucionDotacion />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
