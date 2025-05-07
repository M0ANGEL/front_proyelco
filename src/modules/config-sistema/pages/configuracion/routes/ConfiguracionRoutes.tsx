import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormConfiguracion, ListConfiguracion } from "../pages";

export const ConfiguracionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListConfiguracion />} />
        <Route path="/crear-variable" element={<FormConfiguracion />} />
        <Route path="/editar-variable/:id" element={<FormConfiguracion />} /> 
      </Route>
    </RoutesWithNotFound>
  );
};
