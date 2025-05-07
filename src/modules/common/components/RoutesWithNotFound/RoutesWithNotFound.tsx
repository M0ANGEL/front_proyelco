import { Route, Routes } from "react-router-dom";
import { NotFound } from "../NotFound";
import { RoutesWithNotFoundProps } from "./types";

export const RoutesWithNotFound = ({ children }: RoutesWithNotFoundProps) => {
  return (
    <Routes>
      {children}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
