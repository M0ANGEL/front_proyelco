import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormIA, ListIA } from "../pages";

export const IARoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListIA />} />
        <Route path="/create" element={<FormIA />} />
        <Route path="/edit/:id" element={<FormIA />} />
        <Route path="/show/:id" element={<FormIA />} />
        <Route path="/anular/:id" element={<FormIA />} />
      </Route>
    </RoutesWithNotFound>
  );
};
