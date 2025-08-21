import { useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import { BASE_URL_IMAGENES } from "@/config/api";
import { FaEye } from "react-icons/fa6";

interface VerFotoProps {
  id: number;
}

export const VerFoto = ({ id }: VerFotoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentExtensionIndex, setCurrentExtensionIndex] = useState(0);

  // Extensiones a probar
  const extensions = ["jpg", "jpeg", "png"];

  const imageUrl = `${BASE_URL_IMAGENES}/storage/activos/${id}.${extensions[currentExtensionIndex]}`;

  const handleError = () => {
    if (currentExtensionIndex < extensions.length - 1) {
      setCurrentExtensionIndex((prev) => prev + 1); // probar la siguiente extensión
    } else {
      setImageError(true); // ya no hay más opciones
    }
  };

  return (
    <>
      <Tooltip title="Ver Foto del activo">
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setImageError(false);
            setCurrentExtensionIndex(0);
          }}
          type="primary"
          size="small"
          style={{ marginLeft: "5px", background: "#4523ee" }}
        >
          <FaEye />
        </Button>
      </Tooltip>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        {!imageError ? (
          <img
            src={imageUrl}
            alt={`Activo ${id}`}
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
            onError={handleError}
          />
        ) : (
          <p style={{ textAlign: "center", fontSize: "16px", color: "red" }}>
            🚫 No hay imagen disponible para el activo
          </p>
        )}
      </Modal>
    </>
  );
};
