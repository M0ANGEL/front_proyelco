import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ClientesPage, ClientesRoutes,  } from "../pages";




export const AdministrarClientesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ClientesPage />} />
        <Route path="/administrar-clientes/*" element={<ClientesRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
