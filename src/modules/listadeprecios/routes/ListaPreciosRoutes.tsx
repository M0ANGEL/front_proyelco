import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListapreCliRoutes, ListapreRoutes, PreciosPage } from "../pages";

export const ListaPreciosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<PreciosPage />} />
        <Route path="/listapre/*" element={<ListapreRoutes />} />
        <Route path="/listaprecli/*" element={<ListapreCliRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
