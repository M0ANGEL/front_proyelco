import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormOBP, ListOBP } from "../pages";

export const OBPRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListOBP />} />
        <Route path="/create" element={<FormOBP />} />
        <Route path="/edit/:id" element={<FormOBP />} />
        <Route path="/show/:id" element={<FormOBP />} />
        <Route path="/anular/:id" element={<FormOBP />} />
      </Route>
    </RoutesWithNotFound>
  );
};
