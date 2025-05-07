import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormNCV, ListNCV } from "../pages";

export const NCVRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListNCV />} />
        <Route path="/create" element={<FormNCV />} />
        <Route path="/edit/:id" element={<FormNCV />} />
        <Route path="/show/:id" element={<FormNCV />} />
        <Route path="/anular/:id" element={<FormNCV />} />
      </Route>
    </RoutesWithNotFound>
  );
};
