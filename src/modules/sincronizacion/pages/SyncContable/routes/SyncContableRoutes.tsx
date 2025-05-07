import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormSync } from "../pages";

export const SyncContableRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<FormSync />} />
        <Route path="/create" element={<FormSync/>}/>
        <Route path="/edit/:id" element={<FormSync/>}/>
      </Route>
    </RoutesWithNotFound>
  );
};