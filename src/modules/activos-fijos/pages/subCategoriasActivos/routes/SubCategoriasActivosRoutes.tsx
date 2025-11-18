import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormSubCategoriasActivos, ListSubCategoriasActivos } from "../pages";


export const SubCategoriasActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListSubCategoriasActivos />} />
        <Route path="/create" element={<FormSubCategoriasActivos />} />
        <Route path="/edit/:id" element={<FormSubCategoriasActivos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
