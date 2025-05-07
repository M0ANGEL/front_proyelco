import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormRET, ListRET } from "../pages";

export const RETRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListRET />} />
        <Route path="/create" element={<FormRET />} />
        <Route path="/edit/:id" element={<FormRET />} />
        <Route path="/show/:id" element={<FormRET />} />
        <Route path="/anular/:id" element={<FormRET />} />
      </Route>
    </RoutesWithNotFound>
  );
};
