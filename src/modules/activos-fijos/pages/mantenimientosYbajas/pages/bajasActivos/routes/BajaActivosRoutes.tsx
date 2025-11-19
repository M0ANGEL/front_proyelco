import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListbajaActivos } from "../pages";



export const BajaActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListbajaActivos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
