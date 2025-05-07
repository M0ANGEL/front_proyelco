import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormBodegas, ListBodegas } from "../pages";

export const BodegasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListBodegas />} />
        <Route path="/create" element={<FormBodegas />} />
        <Route path="/edit/:id" element={<FormBodegas />} />
        <Route path="/show/:id" element={<FormBodegas />} />
      </Route>
    </RoutesWithNotFound>
  );
};
