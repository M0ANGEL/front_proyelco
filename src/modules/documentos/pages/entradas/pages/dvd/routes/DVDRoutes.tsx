import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormDVD, ListDVD } from "../pages";

export const DVDRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDVD />} />
        <Route path="/create" element={<FormDVD />} />
        <Route path="/edit/:id" element={<FormDVD />} />
        <Route path="/show/:id" element={<FormDVD />} />
        <Route path="/anular/:id" element={<FormDVD />} />
      </Route>
    </RoutesWithNotFound>
  );
};
