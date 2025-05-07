import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  TercerosRoutes,
  AdminTercerosPage
} from "../pages";

export const AdminTercerosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<AdminTercerosPage />} />
        <Route path="/terceros/*" element={<TercerosRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
