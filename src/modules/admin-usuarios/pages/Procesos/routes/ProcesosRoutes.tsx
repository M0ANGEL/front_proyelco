import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormProcesos, ListProcesos } from "../pages";


export const ProcesosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListProcesos />} />
        <Route path="/create" element={<FormProcesos />} />
        <Route path="/edit/:id" element={<FormProcesos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
