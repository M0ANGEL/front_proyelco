import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { TagAutorizacion } from "../pages/Tag/TagAutorizacion";




export const AutorizacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<TagAutorizacion />} />
      </Route>
    </RoutesWithNotFound>
  );
};
