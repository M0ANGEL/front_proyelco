import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { TrasladosActivosPage } from "../pages/TrasladosActivosPage";
import { TrasladarActivosAdmin, AceptarTraslados, TrasladarActivos, MesajeroActivos, TrasladarPendientesActivosAdmin } from "../pages";

export const TransladosActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<TrasladosActivosPage />} />
        <Route path="RST" element={<TrasladarActivos />} />
        <Route path="APT" element={<AceptarTraslados />} />
        {/* <Route path="SLA" element={<AceptarTraslados />} /> */}
        <Route path="TRM" element={<MesajeroActivos />} />
        <Route path="TRSDM" element={<TrasladarActivosAdmin />} />
        <Route path="TRSDPM" element={<TrasladarPendientesActivosAdmin />} />
      </Route>
    </RoutesWithNotFound>
  );
};
