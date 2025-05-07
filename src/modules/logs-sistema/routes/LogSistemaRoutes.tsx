import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { LogSistemaPage, LogsRoutes } from "../pages";

export const LogSistemaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<LogSistemaPage />} />
        <Route path="/logs/*" element={<LogsRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
