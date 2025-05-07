/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const EntradasPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/documentos");
  }, []);

  return <></>;
};
