import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { CarguePlanosPage} from "../pages";

export const CarguePlanosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<CarguePlanosPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
