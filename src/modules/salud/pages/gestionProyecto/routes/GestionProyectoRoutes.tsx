import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListGestionProyectos } from "../pages/ListGestionProyecto";
import { FormGestionProyectos } from "../pages/FormGestionPoryecto";

export const GestionProyectoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListGestionProyectos />} />
        <Route path="/gestionar/:id" element={<FormGestionProyectos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
