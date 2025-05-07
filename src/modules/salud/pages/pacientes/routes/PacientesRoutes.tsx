import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPacientes, ListPacientes } from "../pages";

export const PacientesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPacientes />} />
        <Route path="/create" element={<FormPacientes />} />
        <Route path="/edit/:id" element={<FormPacientes />} />
        <Route path="/show/:id" element={<FormPacientes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
