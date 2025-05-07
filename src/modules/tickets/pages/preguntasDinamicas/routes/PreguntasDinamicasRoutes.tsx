import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPreguntasDinamicas, ListSPreguntasDinamicas } from "../pages";




export const PreguntasDinamicasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListSPreguntasDinamicas />} />
        <Route path="/create" element={<FormPreguntasDinamicas />} />
        <Route path="/edit/:id" element={<FormPreguntasDinamicas />} />
      </Route>
    </RoutesWithNotFound>
  );
};
