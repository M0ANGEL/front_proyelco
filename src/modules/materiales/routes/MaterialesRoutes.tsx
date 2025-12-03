import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { CargueExcelMaterial, MaterialesPages } from "../pages";
import { ProyeccionRouter } from "../pages/proyeccion/routes";
import { SolicitudMaterialRoutes } from "../pages/solicitudMaterial/routes";




export const MaterialesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<MaterialesPages />} />
        <Route path="/cargar-excel" element={<CargueExcelMaterial />} />
        <Route path="/proyecciones/*" element={<ProyeccionRouter />} />
        <Route path="/solicitudes-materiales-des/*" element={<SolicitudMaterialRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
