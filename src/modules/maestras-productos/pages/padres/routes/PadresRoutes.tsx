import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListPadres, FormPadres } from "../pages";

export const PadresRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPadres />} />
        <Route path="/create" element={<FormPadres />} />
        <Route path="/edit/:id" element={<FormPadres />} />
      </Route>
    </RoutesWithNotFound>
  );
};
