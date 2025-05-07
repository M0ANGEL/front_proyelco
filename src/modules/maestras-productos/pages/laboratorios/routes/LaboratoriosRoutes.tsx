import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormLaboratorios, ListLaboratorios } from "../pages";

export const LaboratoriosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListLaboratorios />} />
        <Route path="/create" element={<FormLaboratorios />} />
        <Route path="/edit/:id" element={<FormLaboratorios />} />
        <Route path="/show/:id" element={<FormLaboratorios />} />
      </Route>
    </RoutesWithNotFound>
  );
};
