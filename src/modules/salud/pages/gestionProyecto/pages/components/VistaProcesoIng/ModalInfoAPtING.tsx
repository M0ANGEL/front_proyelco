import { Apartment } from "@/services/types";
import { Spin } from "antd";

interface ModalInfoAptProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApt: Apartment | null;
  loading: boolean;
}

export const ModalInfoAPtING = ({
  isOpen,
  onClose,
  selectedApt,
  loading,
}: ModalInfoAptProps) => {
  if (!isOpen) return null;

  console.log(selectedApt);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          width: "450px",
          maxWidth: "95%",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          minHeight: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <Spin size="large" />
        ) : (
          selectedApt && (
            <div style={{ width: "100%" }}>
              <h2
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  color: "#1890ff",
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "10px",
                  fontWeight: "600",
                }}
              >
                Información del Apartamento
              </h2>

              <div style={{ marginBottom: "15px" }}>
                {/* confirmador */}
                {selectedApt.nombre ? (
                  <p
                    style={{ margin: "8px 0", fontSize: "16px", color: "#555" }}
                  >
                    <strong
                      style={{
                        color: "#333",
                        display: "inline-block",
                        width: "150px",
                      }}
                    >
                      Quien Confirmó:
                    </strong>{" "}
                    {selectedApt.nombre || "--"}
                  </p>
                ) : (
                  ""
                )}
                {/* consecutivo */}
                <p style={{ margin: "8px 0", fontSize: "16px", color: "#555" }}>
                  <strong
                    style={{
                      color: "#333",
                      display: "inline-block",
                      width: "150px",
                    }}
                  >
                    Consecutivo:
                  </strong>{" "}
                  {selectedApt.consecutivo}
                </p>
                {/* torre */}
                {/* <p style={{ margin: "8px 0", fontSize: "16px", color: "#555" }}>
                  <strong
                    style={{
                      color: "#333",
                      display: "inline-block",
                      width: "150px",
                    }}
                  >
                    Torre:
                  </strong>{" "}
                  {selectedApt.torre}
                </p> */}
                {/* piso */}
                <p style={{ margin: "8px 0", fontSize: "16px", color: "#555" }}>
                  <strong
                    style={{
                      color: "#333",
                      display: "inline-block",
                      width: "150px",
                    }}
                  >
                    Piso:
                  </strong>{" "}
                  {selectedApt.piso}
                </p>
                {/* estado */}
                <p style={{ margin: "8px 0", fontSize: "16px", color: "#555" }}>
                  <strong
                    style={{
                      color: "#333",
                      display: "inline-block",
                      width: "150px",
                    }}
                  >
                    Estado:
                  </strong>{" "}
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background:
                        selectedApt.estado === "2"
                          ? "#52c41a22"
                          : selectedApt.estado === "1"
                          ? "#1890ff22"
                          : "#ff4d4f22",
                      color:
                        selectedApt.estado === "2"
                          ? "#52c41a"
                          : selectedApt.estado === "1"
                          ? "#1890ff"
                          : "#ff4d4f",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedApt.estado == "2"
                      ? "Completado"
                      : selectedApt.estado == "1"
                      ? "Habilitado"
                      : "No habilitado"}
                  </span>
                </p>
                {/* fecha habilitado */}
                {selectedApt.estado === "1" || selectedApt.estado === "2" ? (
                  <p
                    style={{ margin: "8px 0", fontSize: "16px", color: "#555" }}
                  >
                    <strong
                      style={{
                        color: "#333",
                        display: "inline-block",
                        width: "150px",
                      }}
                    >
                      Fecha Habilitado:
                    </strong>{" "}
                    {selectedApt.fecha_habilitado}
                  </p>
                ) : (
                  ""
                )}
                {/* fecha de confirmacion */}
                {selectedApt.estado == "2" ? (
                  <p
                    style={{ margin: "8px 0", fontSize: "16px", color: "#555" }}
                  >
                    <strong
                      style={{
                        color: "#333",
                        display: "inline-block",
                        width: "150px",
                      }}
                    >
                      Fecha Terminado:
                    </strong>{" "}
                    {selectedApt.fecha_fin}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "10px 0",
                  background: "#1890ff",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#40a9ff")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#1890ff")
                }
              >
                Cerrar
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
