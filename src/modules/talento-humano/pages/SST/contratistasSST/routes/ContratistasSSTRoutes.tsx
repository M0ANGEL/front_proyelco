import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormContratistasSST, ListContratistasSST } from "../pages";


export const ContratistasSSTRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListContratistasSST />} />
        <Route path="/create" element={<FormContratistasSST />} />
        <Route path="/edit/:id" element={<FormContratistasSST />} />
      </Route>
    </RoutesWithNotFound>
  );
};
