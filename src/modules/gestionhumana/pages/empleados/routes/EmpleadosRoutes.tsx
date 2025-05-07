import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListEmpleados, FormEmpleados } from "../pages";
import { FormOtrosi } from "../components";

export const EmpleadosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListEmpleados />} />
        <Route path="/create" element={<FormEmpleados />} />
        <Route path="/edit/:id" element={<FormEmpleados />} />
        <Route path="/edit/:id/edit/:id_otrosi" element={<FormOtrosi />} />
      </Route>
    </RoutesWithNotFound>
  );
};
