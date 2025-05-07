import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListAusentismos, FormAusentismos } from "../pages"; 

export const AusentismosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListAusentismos />} />
        <Route path="/create" element={<FormAusentismos />} />
        <Route path="/edit/:id" element={<FormAusentismos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
