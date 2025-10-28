import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { DocumentacionPages } from "../pages/DocumentacionPages";
import { ListRed } from "../pages/GestionDocumentos/GestionOperadorRed/pages/ListRed";




export const DocumentacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<DocumentacionPages />} />
        <Route path="/operador-red/*" element={<ListRed />} />
      </Route>
    </RoutesWithNotFound>
  );
};
