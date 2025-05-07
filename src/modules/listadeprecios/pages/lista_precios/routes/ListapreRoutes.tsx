import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { EditListapre, FormListapre, ImportListapre, ListaPrecios } from "..";

export const ListapreRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListaPrecios />} />
        <Route path="/create" element={<FormListapre />} />
        <Route path="/edit/:id" element={<EditListapre />} />
        <Route path="/import" element={<ImportListapre />} />
      </Route>
    </RoutesWithNotFound>
  );
};
