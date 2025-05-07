import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListTicketsGenerados } from "../pages";

export const GestionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTicketsGenerados />} />
      </Route>
    </RoutesWithNotFound>
  );
};
