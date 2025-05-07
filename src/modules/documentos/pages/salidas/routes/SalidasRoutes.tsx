import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  DPRoutes,
  PATRoutes,
  PPTRoutes,
  FALRoutes,
  ASARoutes,
  SUNRoutes,
  VEARoutes,
  PENRoutes,
  SalidasPage,
  SCORoutes,
} from "../pages";

export const SalidasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<SalidasPage />} />
        <Route path="/dp/*" element={<DPRoutes />} />
        <Route path="/pat/*" element={<PATRoutes />} />
        <Route path="/ppt/*" element={<PPTRoutes />} />
        <Route path="/fal/*" element={<FALRoutes />} />
        <Route path="/asa/*" element={<ASARoutes />} />
        <Route path="/sun/*" element={<SUNRoutes />} />
        <Route path="/vea/*" element={<VEARoutes />} />
        <Route path="/pen/*" element={<PENRoutes />} />
        <Route path="/sco/*" element={<SCORoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
