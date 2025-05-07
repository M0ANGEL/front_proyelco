import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormRVD, ListRVD } from "../pages";

export const RVDRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListRVD />} />
        <Route path="/create" element={<FormRVD />} />
        <Route path="/edit/:id" element={<FormRVD />} />
        <Route path="/show/:id" element={<FormRVD />} />
        <Route path="/anular/:id" element={<FormRVD />} />
      </Route>
    </RoutesWithNotFound>
  );
};
