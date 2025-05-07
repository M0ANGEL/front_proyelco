import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  EntradasPage,
  DVDRoutes,
  RQPRoutes,
  PTERoutes,
  SOBRoutes,
  AENRoutes,
  OBPRoutes,
  RETRoutes,
  EUNRoutes,
  DRVRoutes,
  DVHRoutes,
  CGNRoutes,
  APRRoutes,
  PTORoutes,
  IARoutes,
  FPRoutes,
  OCRoutes,
} from "../pages";

export const EntradasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<EntradasPage />} />
        <Route path="/rqp/*" element={<RQPRoutes />} />
        <Route path="/fp/*" element={<FPRoutes />} />
        <Route path="/dvd/*" element={<DVDRoutes />} />
        <Route path="/dvh/*" element={<DVHRoutes />} />
        <Route path="/oc/*" element={<OCRoutes />} />
        <Route path="/pte/*" element={<PTERoutes />} />
        <Route path="/ret/*" element={<RETRoutes />} />
        <Route path="/sob/*" element={<SOBRoutes />} />
        <Route path="/aen/*" element={<AENRoutes />} />
        <Route path="/drv/*" element={<DRVRoutes />} />
        <Route path="/obp/*" element={<OBPRoutes />} />
        <Route path="/eun/*" element={<EUNRoutes />} />
        <Route path="/ia/*" element={<IARoutes />} />
        <Route path="/cgn/*" element={<CGNRoutes />} />
        <Route path="/apr/*" element={<APRRoutes />} />
        <Route path="/pto/*" element={<PTORoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
