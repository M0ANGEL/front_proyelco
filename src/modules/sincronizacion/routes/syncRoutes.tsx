import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
SyncPage,
SyncContableRoutes,
OpenPlanoLink
} from "../pages";

export const SyncRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<SyncPage/>} />
        <Route path="/sincronizacion/*" element={<SyncContableRoutes />} />
        <Route path="/plano/*"element={<OpenPlanoLink />} />
 </Route>
    </RoutesWithNotFound>
  );
};
