import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormRQP, ListRQP } from "../pages";

export const RQPRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListRQP />} />
        <Route path="/create" element={<FormRQP />} />
        <Route path="/edit/:id" element={<FormRQP />} />
        <Route path="/aprobar/:id" element={<FormRQP />} />
        <Route path="/desaprobar/:id" element={<FormRQP />} />
        <Route path="/show/:id" element={<FormRQP />} />
        <Route path="/anular/:id" element={<FormRQP />} />
      </Route>
    </RoutesWithNotFound>
  );
};
