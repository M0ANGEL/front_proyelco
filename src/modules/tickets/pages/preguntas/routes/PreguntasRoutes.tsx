import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPreguntas, ListPreguntas } from "../pages";




export const PreguntasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPreguntas />} />
        <Route path="/create" element={<FormPreguntas />} />
        <Route path="/edit/:id" element={<FormPreguntas />} />
      </Route>
    </RoutesWithNotFound>
  );
};
