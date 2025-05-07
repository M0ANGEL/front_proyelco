import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListProcesosDisciplinarios, FormProcesosDisciplinarios } from "../../pages";

export const ProcesosDisciplinariosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListProcesosDisciplinarios />} />
        <Route path="/create" element={<FormProcesosDisciplinarios />} />
        <Route path="/edit/:id" element={<FormProcesosDisciplinarios />} />
      </Route>
    </RoutesWithNotFound>
  )
}
