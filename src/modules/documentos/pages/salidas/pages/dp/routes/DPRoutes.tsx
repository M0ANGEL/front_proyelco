import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormDP, ListDP } from "../pages";

export const DPRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDP />} />
        <Route path="/create" element={<FormDP />} />
        <Route path="/edit/:id" element={<FormDP />} />
        <Route path="/show/:id" element={<FormDP />} />
        <Route path="/anular/:id" element={<FormDP />} />
      </Route>
    </RoutesWithNotFound>
  );
};
