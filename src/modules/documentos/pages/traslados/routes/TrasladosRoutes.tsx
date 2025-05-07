import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { TRSRoutes, TRERoutes, TRPRoutes, TrasladosPage } from "../pages";

export const TrasladosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<TrasladosPage />} />
        <Route path="/trs/*" element={<TRSRoutes />} />
        <Route path="/tre/*" element={<TRERoutes />} />
        <Route path="/trp/*" element={<TRPRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
