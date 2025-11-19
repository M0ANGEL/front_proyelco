import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ConfigSisPage } from "../pages/ConfigSisPage";
import { ModuloRoutes } from "../pages/modulos";
import { MenuRoutes } from "../pages/menu";
import { SubmenuRoutes } from "../pages/submenus";


export const ConfigSisRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ConfigSisPage />} />
        <Route path="/modulos/*" element={<ModuloRoutes />} />
        <Route path="/menus/*" element={<MenuRoutes />} />
        <Route path="/submenus/*" element={<SubmenuRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
