import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListTerminarContratos, FormTerminarContratos } from "../pages";

export const TerminarContratosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTerminarContratos />} />
        <Route path="/create" element={<FormTerminarContratos />} />
        <Route path="/edit/:id" element={<FormTerminarContratos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
