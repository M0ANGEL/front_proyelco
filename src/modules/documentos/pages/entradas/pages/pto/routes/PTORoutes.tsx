import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPTO, ListPTO } from "../pages";

export const PTORoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPTO />} />
        <Route path="/create" element={<FormPTO />} />
        <Route path="/edit/:id" element={<FormPTO />} />
        <Route path="/show/:id" element={<FormPTO />} />
        <Route path="/anular/:id" element={<FormPTO />} />
      </Route>
    </RoutesWithNotFound>
  );
};
