import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormListapreCli, ListaPreciosCli, ImportListapreCli, EditListapreCli } from "../pages";

export const ListapreCliRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListaPreciosCli />} />
        <Route path="/create" element={<FormListapreCli />} />
        <Route path="/edit/:id" element={<EditListapreCli />} />
        <Route path="/import" element={<ImportListapreCli />} />
      </Route>
    </RoutesWithNotFound>
  );
};
