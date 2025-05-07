import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormDRV, ListDRV } from "../pages";

export const DRVRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDRV />} />
        <Route path="/create" element={<FormDRV />} />
        <Route path="/edit/:id" element={<FormDRV />} />
        <Route path="/show/:id" element={<FormDRV />} />
        <Route path="/anular/:id" element={<FormDRV />} />
      </Route>
    </RoutesWithNotFound>
  );
};
