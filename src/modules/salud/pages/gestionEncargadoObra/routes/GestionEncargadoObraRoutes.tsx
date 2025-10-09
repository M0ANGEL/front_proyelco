import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormEncargadoObra, GestionCasasEncargadoObra, ListGestionEncargadoObra } from "../pages";


export const GestionEncargadoObraRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListGestionEncargadoObra />} />
        <Route path="/:id" element={<FormEncargadoObra />} />
        <Route path="casas/:id" element={<GestionCasasEncargadoObra />} />
      </Route>
    </RoutesWithNotFound>
  );
};
