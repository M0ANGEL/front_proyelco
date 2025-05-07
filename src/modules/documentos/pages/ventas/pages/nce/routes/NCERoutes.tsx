import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormNCE, ListNCE } from "../pages";

export const NCERoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListNCE />} />
        <Route path="/create" element={<FormNCE />} />
        <Route path="/edit/:id" element={<FormNCE />} />
        <Route path="/show/:id" element={<FormNCE />} />
        <Route path="/anular/:id" element={<FormNCE />} />
      </Route>
    </RoutesWithNotFound>
  );
};
