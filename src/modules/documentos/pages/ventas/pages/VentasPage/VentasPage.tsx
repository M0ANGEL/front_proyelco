/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const VentasPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/documentos");
  }, []);

  return <></>;
};
