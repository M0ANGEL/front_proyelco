import { Route } from "react-router-dom";
import { FormCargos, ListCargos } from "../pages";
import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";

export const CargosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCargos />} />
        <Route path="/create" element={<FormCargos />} />
        <Route path="/edit/:id" element={<FormCargos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
