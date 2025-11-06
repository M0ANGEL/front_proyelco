import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListLinkDescargasAPK } from "../pages";



export const LinkDescargasAPKRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
         <Route path="/" element={<ListLinkDescargasAPK />} />
      </Route>
    </RoutesWithNotFound>
  );
};
