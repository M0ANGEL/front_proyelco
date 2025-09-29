import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { PersonaNoProyelcolRoutes } from "./PersonalNoProyelco";
import { FichasObraRoutes } from "./FichasObra";


export const SSTAdminRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="personal-no-proyelco/*" element={<PersonaNoProyelcolRoutes />} />
        <Route path="administrar-fichas-sst/*" element={<FichasObraRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
