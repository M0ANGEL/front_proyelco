import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListTickets } from "../pages/ListTICKETS";

export const TicketsRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTickets />} />
      </Route>
    </RoutesWithNotFound>
  );
};
