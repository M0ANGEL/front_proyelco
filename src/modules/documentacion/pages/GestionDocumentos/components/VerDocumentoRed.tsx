import { useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import { BASE_URL_IMAGENES } from "@/config/api";
import { FaFileAlt } from "react-icons/fa";

interface VerDocumentoProps {
  codigo_proyecto: string;
  codigo_documento: string;
  nombreProyecto: string;
  etapa: number;
  actividad_id: number;
}

export const VerDocumentoRed = ({
  codigo_proyecto,
  codigo_documento,
  etapa,
  actividad_id,
  nombreProyecto,
}: VerDocumentoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExtensionIndex, setCurrentExtensionIndex] = useState(0);
  const [currentFileType, setCurrentFileType] = useState<
    "image" | "pdf" | "none"
  >("image");

  // Extensiones a probar
  const imageExtensions = ["jpg", "jpeg", "png"];
  const pdfExtension = "pdf";
  const allExtensions = [...imageExtensions, pdfExtension];

  const fileUrl = `${BASE_URL_IMAGENES}/storage/documentacion/red/${codigo_proyecto}-${codigo_documento}-${etapa}-${actividad_id}.${allExtensions[currentExtensionIndex]}`;

  const handleError = () => {
    if (currentExtensionIndex < allExtensions.length - 1) {
      setCurrentExtensionIndex((prev) => prev + 1);
    } else {
      setCurrentFileType("none");
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCurrentExtensionIndex(0);
    setCurrentFileType("image");
  };

  // Determinar el tipo de archivo actual
  const getCurrentFileType = () => {
    const currentExt = allExtensions[currentExtensionIndex];
    if (imageExtensions.includes(currentExt)) return "image";
    if (currentExt === pdfExtension) return "pdf";
    return "none";
  };

  const renderFileContent = () => {
    const fileType = getCurrentFileType();

    switch (fileType) {
      case "image":
        return (
          <img
            src={fileUrl}
            alt={`Proyecto: ${nombreProyecto}`}
            style={{ width: "100%", height: "800px", borderRadius: 8 }}
            onError={handleError}
          />
        );

      case "pdf":
        return (
          <iframe
            src={fileUrl}
            width="100%"
            height="800px"
            title={`Documento: ${nombreProyecto}`}
            style={{ border: "none", borderRadius: 8 }}
            onError={handleError}
          />
        );

      case "none":
        return (
          <p style={{ textAlign: "center", fontSize: "16px", color: "red" }}>
            🚫 No hay documento para esta actividad
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Tooltip title="Ver Documento">
        <Button
          onClick={handleOpenModal}
          type="primary"
          size="small"
          style={{ marginRight: "12px", background: "#4523ee" }}
        >
          <FaFileAlt />
        </Button>
      </Tooltip>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        title={`Documento: ${nombreProyecto}`}
      >
        {renderFileContent()}
      </Modal>
    </>
  );
};
