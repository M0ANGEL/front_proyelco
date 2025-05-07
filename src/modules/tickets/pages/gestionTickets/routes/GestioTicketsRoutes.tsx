import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListTickets } from "../pages/GestioEstadosTickets/pages/ListGestio";

export const GestionTicketsRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTickets />} />
      </Route>
    </RoutesWithNotFound>
  );
};
