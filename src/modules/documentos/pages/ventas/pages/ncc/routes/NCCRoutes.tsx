import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormNCC, ListNCC } from "../pages";

export const NCCRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListNCC />} />
        <Route path="/create" element={<FormNCC />} />
        <Route path="/edit/:id" element={<FormNCC />} />
        <Route path="/show/:id" element={<FormNCC />} />
        <Route path="/anular/:id" element={<FormNCC />} />
      </Route>
    </RoutesWithNotFound>
  );
};
