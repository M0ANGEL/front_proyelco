import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListLinkDescargasAPK } from "../linkDescargas";




export const ApkRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/link-appdsdsdsds" element={<ListLinkDescargasAPK />} />
      </Route>
    </RoutesWithNotFound>
  );
};
