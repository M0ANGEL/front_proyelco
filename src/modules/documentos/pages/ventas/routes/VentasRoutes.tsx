import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  DISRoutes,
  FVCRoutes,
  NCCRoutes,
  NDRoutes,
  NCERoutes,
  NCVRoutes,
  RVDRoutes,
  NCGRoutes,
  VentasPage,
} from "../pages";

export const VentasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<VentasPage />} />
        <Route path="/dis/*" element={<DISRoutes />} />
        <Route path="/rvd/*" element={<RVDRoutes />} />
        <Route path="/fvc/*" element={<FVCRoutes />} />
        <Route path="/ncc/*" element={<NCCRoutes />} />
        <Route path="/nd/*" element={<NDRoutes />} />
        <Route path="/nce/*" element={<NCERoutes />} />
        <Route path="/ncg/*" element={<NCGRoutes />} />
        <Route path="/ncv/*" element={<NCVRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
