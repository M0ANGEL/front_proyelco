import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormInformesPowerBI, ListInformesPowerBI} from "../pages";



export const InformesPowerBIRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListInformesPowerBI />} />
        <Route path="/create" element={<FormInformesPowerBI />} />
        <Route path="/edit/:id" element={<FormInformesPowerBI />} />
      </Route>
    </RoutesWithNotFound>
  );
};
