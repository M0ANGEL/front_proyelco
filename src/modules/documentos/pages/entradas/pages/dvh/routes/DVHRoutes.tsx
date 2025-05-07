import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormDVH, ListDVH } from "../pages";

export const DVHRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDVH />} />
        <Route path="/create" element={<FormDVH />} />
        <Route path="/edit/:id" element={<FormDVH />} />
        <Route path="/show/:id" element={<FormDVH />} />
        <Route path="/anular/:id" element={<FormDVH />} />
      </Route>
    </RoutesWithNotFound>
  );
};
