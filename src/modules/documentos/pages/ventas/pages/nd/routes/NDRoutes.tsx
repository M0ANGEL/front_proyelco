import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormND, ListND } from "../pages";

export const NDRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListND />} />
        <Route path="/create" element={<FormND />} />
        <Route path="/edit/:id" element={<FormND />} />
        <Route path="/show/:id" element={<FormND />} />
        <Route path="/anular/:id" element={<FormND />} />
      </Route>
    </RoutesWithNotFound>
  );
};
