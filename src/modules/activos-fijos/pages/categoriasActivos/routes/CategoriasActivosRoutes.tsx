import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormCategoriasActivos, ListCategoriasActivos } from "../pages";


export const CategoriasActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCategoriasActivos />} />
        <Route path="/create" element={<FormCategoriasActivos />} />
        <Route path="/edit/:id" element={<FormCategoriasActivos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
