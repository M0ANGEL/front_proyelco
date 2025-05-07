import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListSeguimiento } from "../pages";

export const SeguimientoRoute = () => {
    return (
        <RoutesWithNotFound>
            <Route element={<AuthGuard/>}>
                <Route path="/" element={<ListSeguimiento />} />
            </Route>
        </RoutesWithNotFound>
    );
}