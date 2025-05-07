import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormDistCompras, ListDistCompras } from "../pages";

export const DistComprasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDistCompras />} />
        <Route path="/create" element={<FormDistCompras />} />
        <Route path="/edit/:id" element={<FormDistCompras />} />
      </Route>
    </RoutesWithNotFound>
  );
};
