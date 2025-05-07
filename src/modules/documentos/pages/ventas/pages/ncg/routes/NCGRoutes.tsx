import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormNCG, ListNCG } from "../pages";

export const NCGRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListNCG />} />
        <Route path="/create" element={<FormNCG />} />
        <Route path="/edit/:id" element={<FormNCG />} />
        <Route path="/show/:id" element={<FormNCG />} />
        <Route path="/anular/:id" element={<FormNCG />} />
      </Route>
    </RoutesWithNotFound>
  );
};
