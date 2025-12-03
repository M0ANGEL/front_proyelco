import { useState, useEffect } from "react";
import { Button, Modal, Tooltip, List } from "antd";
import { BASE_URL_IMAGENES, BASE_URL } from "@/config/api";
import { FaFileAlt } from "react-icons/fa";

interface VerDocumentoProps {
  documento_id: number;
  nombreProyecto: string;
}

export const VerDocumentoOrganismos = ({
  documento_id,
  nombreProyecto,
}: VerDocumentoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [archivos, setArchivos] = useState<any[]>([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<any>(null);

  const abrirModal = async () => {
    if (!documento_id) {
      console.error("documento_id no definido");
      return;
    }

    setIsModalOpen(true);

    try {
      const res = await fetch(
        `${BASE_URL}documentos-adjuntos-organismos/${documento_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setArchivos(data);
    } catch (error) {
      console.error("Error cargando adjuntos:", error);
    }
  };

 const renderContenido = () => {
  if (!archivoSeleccionado) {
    return <p style={{ textAlign: "center" }}>Seleccione un archivo</p>;
  }

  const url = `${BASE_URL_IMAGENES}${archivoSeleccionado.ruta_archivo.replace(/^\/+/, "")}`;

  if (["jpg", "jpeg", "png"].includes(archivoSeleccionado.extension.toLowerCase())) {
    return (
      <img
        src={url}
        style={{ width: "100%", height: "800px", borderRadius: 8 }}
        alt="Vista previa"
      />
    );
  }

  if (archivoSeleccionado.extension.toLowerCase() === "pdf") {
    return (
      <iframe
        src={url}
        width="100%"
        height="800px"
        style={{ border: "none", borderRadius: 8 }}
      />
    );
  }

  return (
    <p style={{ color: "red", textAlign: "center" }}>
      Archivo no soportado para vista previa
    </p>
  );
};


  return (
    <>
      <Tooltip title="Ver Documentos">
        <Button
          type="primary"
          size="small"
          onClick={abrirModal}
          style={{ marginRight: "12px", background: "#4523ee" }}
        >
          <FaFileAlt />
        </Button>
      </Tooltip>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
        title={`Documentos: ${nombreProyecto}`}
      >
        <List
          bordered
          dataSource={archivos}
          style={{ marginBottom: 20 }}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => setArchivoSeleccionado(item)}
            >
              📄 {item.nombre_original}
            </List.Item>
          )}
        />

        {renderContenido()}
      </Modal>
    </>
  );
};
