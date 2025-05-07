import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormCGN, ListCGN } from "../pages";

export const CGNRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCGN />} />
        <Route path="/create" element={<FormCGN />} />
        <Route path="/edit/:id" element={<FormCGN />} />
        <Route path="/show/:id" element={<FormCGN />} />
        <Route path="/anular/:id" element={<FormCGN />} />
      </Route>
    </RoutesWithNotFound>
  );
};
