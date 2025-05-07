import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListPreselecciones, FormPreselecciones, FormCargueDocumentos } from "../pages";

export const PreseleccionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPreselecciones />} />
        <Route path="/create" element={<FormPreselecciones />} />
        <Route path="/edit/:id" element={<FormPreselecciones />} />
        <Route path="/upload/:id" element={<FormCargueDocumentos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
