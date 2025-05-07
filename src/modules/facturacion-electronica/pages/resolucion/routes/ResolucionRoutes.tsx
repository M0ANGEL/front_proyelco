import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListResolucion,FormResolucion } from "../pages";

export const ResolucionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListResolucion />} />
        <Route path="/create" element={<FormResolucion/>}/>
        <Route path="/edit/:id" element={<FormResolucion/>}/>
      </Route>
    </RoutesWithNotFound>
  );
};
