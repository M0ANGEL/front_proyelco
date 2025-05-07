import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPend, ListPend } from "../pages";

export const PENRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPend />} />
        <Route path="/create" element={<FormPend />} />
        <Route path="/edit/:id" element={<FormPend />} />
        <Route path="/show/:id" element={<FormPend />} />
        <Route path="/anular/:id" element={<FormPend />} />
        <Route path="/pagar/:id" element={<FormPend />} />
        <Route path="/cancelar/:id" element={<FormPend />} />
      </Route>
    </RoutesWithNotFound>
  );
};
