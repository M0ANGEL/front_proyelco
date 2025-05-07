import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
// import { ListAusentismos, FormAusentismos } from "../pages"; 
import { ListAlertasContratos, FormAlertasContratos  } from '../pages';

export const AlertasContratosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListAlertasContratos />} />
        {/* <Route path="/create" element={<FormAlertasContratos />} /> */}
        <Route path="/edit/:id" element={<FormAlertasContratos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
