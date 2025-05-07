import { Navigate, Route } from "react-router-dom";
import useToken from "@/modules/common/hooks/useToken";
import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthRoutesList, LoginPage } from "..";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";

export const AuthRoutes = () => {
  const { token } = useToken();
  const { getSessionVariable } = useSessionStorage();

  if (
    token &&
    getSessionVariable(KEY_BODEGA) &&
    getSessionVariable(KEY_EMPRESA)
  ) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <RoutesWithNotFound>
      <Route path={`/${AuthRoutesList.LOGIN}`} element={<LoginPage />} />
    </RoutesWithNotFound>
  );
};
