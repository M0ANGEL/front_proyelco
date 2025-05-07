import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListDescargaZip } from "../pages";

export const DescargaZipRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDescargaZip />} />
      </Route>
    </RoutesWithNotFound>
  );
};