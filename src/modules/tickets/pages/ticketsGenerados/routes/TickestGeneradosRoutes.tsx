import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListTicketsGenerados } from "../pages/GestioEstadosTicketsGenerados/pages/ListGestioGenerados/ListTicketsGenerados";

export const TickestGeneradosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTicketsGenerados />} />
      </Route>
    </RoutesWithNotFound>
  );
};
