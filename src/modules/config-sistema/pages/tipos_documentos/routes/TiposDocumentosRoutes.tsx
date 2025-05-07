import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormTiposDocumentos, ListTiposDocumentos } from "../pages";

export const TiposDocumentosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTiposDocumentos />} />
        <Route path="/create" element={<FormTiposDocumentos />} />
        <Route path="/edit/:id" element={<FormTiposDocumentos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
