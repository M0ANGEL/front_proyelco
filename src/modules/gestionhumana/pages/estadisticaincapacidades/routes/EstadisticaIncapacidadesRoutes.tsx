import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
// import { ListIncapacidades, FormIncapacidades } from "../pages";
import { ListEstadisticaIncapacidades } from "../pages";

export const EstadisticaIncapacidadesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListEstadisticaIncapacidades />} />
        {/* <Route path="/create" element={<FormIncapacidades />} />
        <Route path="/edit/:id" element={<FormIncapacidades />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
