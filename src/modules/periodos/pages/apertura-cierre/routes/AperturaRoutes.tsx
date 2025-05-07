import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormAUD, ListPeriodos } from "../pages";

export const AperturaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPeriodos />} />
        <Route path="/create" element={<FormAUD />} />
        <Route path="/edit/:id" element={<FormAUD />} />
        <Route path="/show/:id" element={<FormAUD />} />
        <Route path="/anular/:id" element={<FormAUD />} />
      </Route>
    </RoutesWithNotFound>
  );
};
