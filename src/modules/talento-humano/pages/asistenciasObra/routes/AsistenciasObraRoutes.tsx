import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormAsistenciasObra, ListAsistenciasObra } from "../pages";




export const AsistenciasObraRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListAsistenciasObra />} />
        <Route path="/create" element={<FormAsistenciasObra />} />
        <Route path="/edit/:id" element={<FormAsistenciasObra />} />
      </Route>
    </RoutesWithNotFound>
  );
};
