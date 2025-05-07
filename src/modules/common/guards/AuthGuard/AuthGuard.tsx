import { Navigate, Outlet } from "react-router-dom";
import { AuthRoutesList } from "@/modules/auth";
import useToken from "../../hooks/useToken";
import useSessionStorage from "../../hooks/useSessionStorage";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";

export const AuthGuard = () => {
  const { getToken } = useToken();
  const { getSessionVariable } = useSessionStorage();

  if (
    getToken() &&
    getSessionVariable(KEY_EMPRESA) &&
    getSessionVariable(KEY_BODEGA)
  ) {
    return (
      <>
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Navigate
        replace
        to={`/${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`}
      />
    </>
  );
};
