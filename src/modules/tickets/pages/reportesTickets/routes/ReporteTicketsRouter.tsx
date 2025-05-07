import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ReporteTickets } from "../pages";




export const ReporteTicketsRoute = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ReporteTickets />} />
      </Route>
    </RoutesWithNotFound>
  );
};
