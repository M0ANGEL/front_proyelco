import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormConceptos, ListConceptos } from "../pages";

export const ConceptosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListConceptos />} />
        <Route path="/create" element={<FormConceptos />} />
        <Route path="/edit/:id" element={<FormConceptos />} />
        <Route path="/show/:id" element={<FormConceptos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
