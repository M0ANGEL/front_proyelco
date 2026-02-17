import { useState } from "react";
import { Button, Modal, Tooltip, List, Spin } from "antd";
import { BASE_URL_IMAGENES, BASE_URL } from "@/config/api";

interface VerDocumentoProps {
  documento_id: number;
  nombreProyecto: string;
}

export const VerDocumentoRed = ({
  documento_id,
  nombreProyecto,
}: VerDocumentoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [archivos, setArchivos] = useState<any[]>([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const abrirModal = async () => {
    if (!documento_id) {
      console.error("documento_id no definido");
      return;
    }

    setIsModalOpen(true);
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}documentos-adjuntos/${documento_id}`,
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
      setArchivos(data || []);
    } catch (error) {
      console.error("Error cargando adjuntos:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContenido = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin />
          <p>Cargando archivos...</p>
        </div>
      );
    }

    if (archivos.length === 0) {
      return <p style={{ textAlign: "center", padding: 20 }}>No hay documentos adjuntos para esta actividad</p>;
    }

    if (!archivoSeleccionado) {
      return <p style={{ textAlign: "center", padding: 20 }}>Seleccione un archivo de la lista</p>;
    }

    const url = `${BASE_URL_IMAGENES}${archivoSeleccionado.ruta_archivo.replace(/^\/+/, "")}`;

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(archivoSeleccionado.extension.toLowerCase())) {
      return (
        <img
          src={url}
          style={{ width: "100%", height: "600px", borderRadius: 8, objectFit: "contain" }}
          alt="Vista previa"
        />
      );
    }

    if (archivoSeleccionado.extension.toLowerCase() === "pdf") {
      return (
        <iframe
          src={url}
          width="100%"
          height="600px"
          style={{ border: "none", borderRadius: 8 }}
          title="Vista previa PDF"
        />
      );
    }

    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <p style={{ color: "red" }}>
          Archivo no soportado para vista previa
        </p>
        <Button 
          type="primary" 
          href={url} 
          target="_blank"
          style={{ marginTop: 10 }}
        >
          Descargar archivo
        </Button>
      </div>
    );
  };

  return (
    <>
      <Tooltip title="Ver Documentos">
        <Button
          type="default"
          size="small"
          onClick={abrirModal}
          style={{ 
            marginRight: "12px", 
            borderColor: "#c1baba",
          }}
        >
          📎
        </Button>
      </Tooltip>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setArchivoSeleccionado(null);
          setArchivos([]);
        }}
        footer={null}
        width={900}
        title={`Documentos: ${nombreProyecto}`}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin />
            <p>Cargando archivos...</p>
          </div>
        ) : archivos.length === 0 ? (
          <p style={{ textAlign: "center", padding: 20 }}>
            No hay documentos adjuntos para esta actividad
          </p>
        ) : (
          <>
            <List
              bordered
              dataSource={archivos}
              style={{ 
                marginBottom: 20, 
                maxHeight: 200, 
                overflow: "auto",
                backgroundColor: "#f5f5f5"
              }}
              renderItem={(item) => (
                <List.Item
                  style={{ 
                    cursor: "pointer",
                    backgroundColor: archivoSeleccionado?.id === item.id ? "#e6f7ff" : "transparent",
                    transition: "background-color 0.3s",
                  }}
                  onClick={() => setArchivoSeleccionado(item)}
                  onMouseEnter={(e) => {
                    if (archivoSeleccionado?.id !== item.id) {
                      e.currentTarget.style.backgroundColor = "#f0f0f0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (archivoSeleccionado?.id !== item.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  📄 {item.nombre_original}
                </List.Item>
              )}
            />

            {renderContenido()}
          </>
        )}
      </Modal>
    </>
  );
};