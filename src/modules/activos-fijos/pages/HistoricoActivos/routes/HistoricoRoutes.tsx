import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListHistoricoActivo  } from "../Pages";

export const HistoricoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListHistoricoActivo/>} />


        
      </Route>
    </RoutesWithNotFound>
  );
};
