import {
  Spin,
  Typography,
  Button,
  Progress,
  List,
  Tooltip,
  Modal,
  Collapse,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  getProyectoDetalleGestionCasa,
  InfoProyectoCasa,
} from "@/services/proyectos/casasProyectosAPI";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { AiOutlineExpandAlt } from "react-icons/ai";

const { Title, Text } = Typography;

export const ResumenManzanasIng = () => {
  const [data, setData] = useState<any>({});
  const [porcetanjeManzana, setPorcetanjeManzana] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [infoProyecto, setInfoProyecto] = useState<any>({});
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { Panel } = Collapse;

  // modal de procesos
  const [modalProcesosOpen, setModalProcesosOpen] = useState(false);
  const [manzanaSeleccionada, setManzanaSeleccionada] = useState<string | null>(
    null
  );

  useEffect(() => {
    LlamadoData();
    InfoProyectoCasa(Number(id)).then(({ data: { data } }) => {
      setInfoProyecto(data);
    });
  }, [id]);

  const LlamadoData = () => {
    setLoading(true);
    getProyectoDetalleGestionCasa(Number(id)).then(({ data }) => {
      setData(data.data);
      setPorcetanjeManzana(data.manzanaResumen);
      setLoading(false);
    });
  };

  const manzanasUnicas = Object.keys(data);

  return (
    <>
      <div
        style={{
          padding: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
          background: "linear-gradient(to bottom right, #f8f9fa, #ffffff)",
          minHeight: "100vh",
        }}
      >
        <div style={{ marginBottom: 15, textAlign: "right" }}>
          <Link to="../.." relative="path">
            <Button danger type="primary" icon={<ArrowLeftOutlined />}>
              Volver
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            marginBottom: "32px",
            border: "none",
            position: "sticky",
            top: 60,
            zIndex: 100,
          }}
        >
          <Title
            level={3}
            style={{
              margin: 0,
              color: "#1a1a1a",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "32px",
                background: "linear-gradient(to bottom, #1890ff, #36cfc9)",
                borderRadius: "4px",
              }}
            ></span>
            Visual del Proyecto: {infoProyecto?.descripcion_proyecto}
          </Title>
          <Text type="secondary" style={{ marginLeft: "20px" }}>
            ID: {id} | Seleccione una manzana para gestionar
          </Text>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "16px",
              backdropFilter: "blur(4px)",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={manzanasUnicas}
              renderItem={(manzana) => (
                <List.Item
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    padding: "16px 24px",
                    border: "2px solid transparent",
                    animation:
                      (porcetanjeManzana[manzana]?.porcentaje_atraso || 0) >= 30
                        ? "pulseRed 2s infinite"
                        : "",
                  }}
                >
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      Manzana{" "}
                      {porcetanjeManzana[manzana]?.nombre_manzana ||
                        `Manzana ${manzana}`}
                    </Title>
                  </div>

                  <div style={{ minWidth: "200px" }}>
                    <Text type="secondary">Atraso del proyecto</Text>
                    <Progress
                      percent={
                        porcetanjeManzana[manzana]?.porcentaje_atraso || 0
                      }
                      strokeColor={
                        (porcetanjeManzana[manzana]?.porcentaje_atraso || 0) <=
                        15
                          ? "blue"
                          : (porcetanjeManzana[manzana]?.porcentaje_atraso ||
                              0) <= 30
                          ? "yellow"
                          : "red"
                      }
                    />

                    <Text type="secondary">Avance del proyecto</Text>
                    <Progress
                      percent={
                        porcetanjeManzana[manzana]?.porcentaje_avance || 0
                      }
                      strokeColor={{
                        "0%": "#102c9dff",
                        "100%": "#36cf55ff",
                      }}
                    />
                  </div>

                  <div
                    className="status-container"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                    }}
                  >
                    {porcetanjeManzana && (
                      <Button
                        type="primary"
                        onClick={() => {
                          setManzanaSeleccionada(manzana);
                          setModalProcesosOpen(true);
                        }}
                      >
                        Procesos y avances
                      </Button>
                    )}

                    <Tooltip title="Ver Proceso Proyecto">
                      <Link
                        to={`${location.pathname}/detalle`}
                        state={{
                          data,
                          porcetanjeManzana,
                          infoProyecto,
                          id,
                          manzana,
                        }}
                      >
                        <ButtonTag
                          style={{
                            padding: 5,
                            borderRadius: 8,
                            width: 40,
                            backgroundColor: "#B5EAD7",
                            border: "none",
                            color: "#2C5F2D",
                          }}
                          type="primary"
                        >
                          <AiOutlineExpandAlt />
                        </ButtonTag>
                      </Link>
                    </Tooltip>
                  </div>
                </List.Item>
              )}
            />
          </>
        )}
      </div>

      {/* Modal Jerárquico */}
      <Modal
        open={modalProcesosOpen}
        onCancel={() => {
          setModalProcesosOpen(false);
          setManzanaSeleccionada(null);
        }}
        footer={null}
        title={`Detalle de manzana: ${
          manzanaSeleccionada
            ? porcetanjeManzana[manzanaSeleccionada]?.nombre_manzana ||
              `Manzana ${manzanaSeleccionada}`
            : "Manzana"
        }`}
        centered
        width={500}
      >
        <Collapse accordion>
          {manzanaSeleccionada &&
            Object.entries(data[manzanaSeleccionada] || {}).map(
              ([casaKey, casaContenido]: any) => (
                <Panel
                  style={{ background: "#1a4c9e" }}
                  key={casaKey}
                  header={
                    <Title level={5} style={{ margin: 0, color: "white" }}>
                      🏠 Casa {casaContenido.consecutivo}
                    </Title>
                  }
                >
                  {/* Pisos dentro del acordeón */}
                  {Object.entries(casaContenido.pisos?.[1] || {}).map(
                    ([pisoKey, procesos]: any) => (
                      <div key={pisoKey} style={{ marginBottom: "16px" }}>
                        <Text underline strong>
                          Piso {pisoKey}
                        </Text>
                        <div style={{ marginLeft: 16, marginTop: 6 }}>
                          {Object.entries(procesos).map(
                            ([procesoKey, proceso]: any) => (
                              <div
                                key={procesoKey}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "6px 10px",
                                  border: "1px solid #eee",
                                  borderRadius: "6px",
                                  backgroundColor: "#fff",
                                  marginBottom: 6,
                                }}
                              >
                                <Text>{proceso.nombre_proceso}</Text>

                                <Tooltip title={`Estado: ${proceso.estado}`}>
                                  <div
                                    style={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: "50%",
                                      background:
                                        proceso.estado === "2"
                                          ? "#36cf55"
                                          : proceso.estado === "1"
                                          ? "#1890ff"
                                          : "#d9d9d9",
                                    }}
                                  ></div>
                                </Tooltip>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </Panel>
              )
            )}
        </Collapse>
      </Modal>
    </>
  );
};
