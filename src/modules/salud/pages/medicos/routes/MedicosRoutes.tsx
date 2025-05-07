import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormMedicos, ListMedicos } from "../pages";

export const MedicosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListMedicos />} />
        <Route path="/create" element={<FormMedicos />} />
        <Route path="/edit/:id" element={<FormMedicos />} />
        <Route path="/show/:id" element={<FormMedicos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
