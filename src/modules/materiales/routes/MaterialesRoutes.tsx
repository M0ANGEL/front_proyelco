import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { CargueExcelMaterial, MaterialesPages } from "../pages";
import { ProyeccionRouter } from "../pages/proyeccion/routes";




export const MaterialesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<MaterialesPages />} />
        <Route path="/cargar-excel" element={<CargueExcelMaterial />} />
        <Route path="/proyecciones/*" element={<ProyeccionRouter />} />
      </Route>
    </RoutesWithNotFound>
  );
};
