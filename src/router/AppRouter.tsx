import { AuthRoutes } from "@/modules/auth/routes/AuthRoutes";
import {
 /*  ParticlesBackground,*/  ParticlesFlores, RoutesWithNotFound,
} from "@/modules/common/components";
import { Route, Navigate } from "react-router-dom";
import { AdminRoutes } from "./AdminRoutes";
import { AuthRoutesList } from "@/modules/auth";
import { AuthGuard } from "@/modules/common/guards";

export const AppRouter = () => {
  return (
    <>
      <ParticlesFlores /> {/* animacion en el menu */}
      
      <RoutesWithNotFound>
        <Route path={`${AuthRoutesList.AUTH}/*`} element={<AuthRoutes />} />
        <Route element={<AuthGuard />}>
          <Route
            path="/"
            element={
              <Navigate to={`${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`} />
            }
          />
          <Route path="/*" element={<AdminRoutes />} />
        </Route>
      </RoutesWithNotFound>
    </>
  );
};
