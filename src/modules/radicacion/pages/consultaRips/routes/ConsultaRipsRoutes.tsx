import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListConsultaRips } from "../pages";

export const ConsultaRipsRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListConsultaRips />} />
      </Route>
    </RoutesWithNotFound>
  );
};