import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { DocumentacionPages } from "../pages/DocumentacionPages";
import { ListRed } from "../pages/GestionDocumentos/GestionOperadorRed/pages/ListRed";
import ModuleNotAvailable from "@/modules/common/guards/NotFound/ModuleNotAvailable";




export const DocumentacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<DocumentacionPages />} />
        <Route path="/documentacion-all/*" element={<ListRed />} />
        <Route path="/configuracion-actividades-documentos/*" element={<ModuleNotAvailable />} />
      </Route>
    </RoutesWithNotFound>
  );
};
