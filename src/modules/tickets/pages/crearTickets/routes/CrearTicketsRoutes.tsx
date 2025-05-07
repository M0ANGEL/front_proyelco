import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormCrearTickets } from "../pages";
import { TagCrearTickets } from "../pages/Tag";




export const CrearTicketsRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<TagCrearTickets />} />
        <Route path="/create" element={<FormCrearTickets />} />
        <Route path="/edit/:id" element={<FormCrearTickets />} />
      </Route>
    </RoutesWithNotFound>
  );
};
