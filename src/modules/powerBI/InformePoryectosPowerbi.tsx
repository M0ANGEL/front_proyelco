import { getLinkPowerBi } from "@/services/powerBi/InformesPowerBiAPI";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const InformePoryectosPowerbi = () => {
  const location = useLocation();
  const [link, setLink] = useState<string>("");

  useEffect(() => {
    // obtener la última parte de la ruta
    const ultimaParte = location.pathname.split("/").filter(Boolean).pop();

    if (!ultimaParte) return;

    // llamada a la API
    getLinkPowerBi({ ruta: ultimaParte })
      .then((res) => {
        // suponiendo que la API retorna { link: "..." }
        setLink(res.data.link);
      })
      .catch((err) => {
        console.error("Error al obtener el link:", err);
      });
  }, [location.pathname]);

  return (
    <div className="flex justify-center items-center w-full h-full p-4">
      {link ? (
        <iframe
          title="Informe Power BI"
          width="100%"
          height="800"
          src={link}
          frameBorder="0"
          allowFullScreen
          className="rounded-2xl shadow-lg"
        ></iframe>
      ) : (
        <p className="text-white text-lg">Cargando informe...</p>
      )}
    </div>
  );
};
