import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListDocumentosAuditoria, FormDocumentosAuditoria } from "../pages";

export const DocumentosAuditoriaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDocumentosAuditoria />} />
        <Route path="/create" element={<FormDocumentosAuditoria />} />
        <Route path="/edit/:id" element={<FormDocumentosAuditoria />} />
      </Route>
    </RoutesWithNotFound>
  );
};
