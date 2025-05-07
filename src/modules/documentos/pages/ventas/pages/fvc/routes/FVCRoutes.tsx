import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormFVC, ListFVC } from "../pages";

export const FVCRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListFVC />} />
        <Route path="/create" element={<FormFVC />} />
        <Route path="/edit/:id" element={<FormFVC />} />
        <Route path="/show/:id" element={<FormFVC />} />
        <Route path="/anular/:id" element={<FormFVC />} />
      </Route>
    </RoutesWithNotFound>
  );
};
