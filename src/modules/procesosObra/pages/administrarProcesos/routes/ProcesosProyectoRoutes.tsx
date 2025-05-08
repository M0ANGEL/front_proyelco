import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormProcesosProyecto, ListProcesosProyecto } from "../pages";



export const ProcesosProyectoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListProcesosProyecto />} />
        <Route path="/create" element={<FormProcesosProyecto />} />
        <Route path="/edit/:id" element={<FormProcesosProyecto />} />
      </Route>
    </RoutesWithNotFound>
  );
};
