import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListLinkDescargasAPK } from "../App/linkDescargas";




export const ExtrasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/link-app/*" element={<ListLinkDescargasAPK />} />
      </Route>
    </RoutesWithNotFound>
  );
};
