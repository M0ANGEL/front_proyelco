import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { MarcacionPages } from "../pages/marcacionPages/MarcacionPages";
import { AdminTelefonoRoute } from "../pages/adminTelefonos/routes/AdminTelefonoRoute";
import { LinkDescargasRoutes } from "../pages/linkDescarga/routes";
import { RegistroMarcacionesRoutes } from "../pages/registroMarcaciones/routes";
import { ReporteMarcacionesRouter } from "../pages/reportesMarcaciones";
import { UsuariosRegistradosRouter } from "../pages";
// import { RegistroFarmaciasRoutes } from "../pages/registroFarmacias/routes";




export const MarcacionAsistenciasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
       <Route path="/" element={<MarcacionPages />} />
        <Route path="/ma-configuracion-telefono/*" element={<AdminTelefonoRoute />} />
        <Route path="/link-descarga-app/*" element={<LinkDescargasRoutes />} />
        <Route path="/registro-marcaciones/*" element={<RegistroMarcacionesRoutes />} />
        <Route path="/ma-reporte-asistencias/*" element={<ReporteMarcacionesRouter />} />
        <Route path="/ma-usuarios-enrolados/*" element={<UsuariosRegistradosRouter />} />
      </Route>
    </RoutesWithNotFound>
  );
};
