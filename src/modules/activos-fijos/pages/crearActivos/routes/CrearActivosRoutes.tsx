import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormCrearActivos, ListCrearActivos } from "../pages";


export const CrearActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCrearActivos />} />
        <Route path="/create" element={<FormCrearActivos />} />
        <Route path="/edit/:id" element={<FormCrearActivos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
