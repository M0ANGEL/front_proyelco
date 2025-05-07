import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListBancos, FormBancos } from "../pages";

export const BancosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListBancos />} />
        <Route path="/create" element={<FormBancos />} />
        <Route path="/edit/:id" element={<FormBancos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
