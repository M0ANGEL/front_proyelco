import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListDevolucionDotaciones, FormDevolucionDotaciones } from "../pages";

export const DevolucionDotacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDevolucionDotaciones />} />
        <Route path="/create" element={<FormDevolucionDotaciones />} />
        <Route path="/edit/:id" element={<FormDevolucionDotaciones />} />
      </Route>
    </RoutesWithNotFound>
  );
};
