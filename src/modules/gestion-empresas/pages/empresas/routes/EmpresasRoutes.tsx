import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormEmpresas, ListEmpresas } from "../pages";

export const EmpresasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListEmpresas />} />
        <Route path="/create" element={<FormEmpresas />} />
        <Route path="/edit/:id" element={<FormEmpresas />} />
      </Route>
    </RoutesWithNotFound>
  );
};
