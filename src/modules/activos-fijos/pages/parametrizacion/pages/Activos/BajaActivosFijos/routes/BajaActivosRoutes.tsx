import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormBajaActivos } from "../pages/FormBajaActivosFijos";
import { ListBajaActivosFijos } from "../pages/ListBajaActivosFijos";
import { FormBajaActivosMasivos } from "../pages/FormBajaActivosMasivos";

export const BajaActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="crear-activo" element={<FormBajaActivos/>} />
        <Route path="crear-activo-masivos" element={<FormBajaActivosMasivos/>} />

        <Route path="/" element={<ListBajaActivosFijos/>} />
        

        
      </Route>
    </RoutesWithNotFound>
  );
};
