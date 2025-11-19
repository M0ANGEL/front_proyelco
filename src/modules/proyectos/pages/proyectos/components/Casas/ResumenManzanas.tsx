import {
  Spin,
  Typography,
  Button,
  Progress,
  List,
  Tooltip,
  Modal,
  Collapse,
  Tag,
  Row,
  Col,
  Statistic,
  Card,
  Divider,
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

export const ResumenManzanas = () => {
  const [data, setData] = useState<any>({});
  const [porcetanjeManzana, setPorcetanjeManzana] = useState<any>({});
  const [casaResumen, setCasaResumen] = useState<any>({});
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
      setCasaResumen(data.casaResumen);
      setLoading(false);
    });
  };

  // Función para obtener el color del estado
  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "2":
        return "green"; // Completado
      case "1":
        return "blue"; // En progreso
      case "0":
        return "default"; // Pendiente
      default:
        return "default";
    }
  };

  // Función para obtener el texto del estado
  const getTextoEstado = (estado: string) => {
    switch (estado) {
      case "2":
        return "Completado";
      case "1":
        return "En Progreso";
      case "0":
        return "Pendiente";
      default:
        return "Desconocido";
    }
  };

  // Función para obtener el color de la etapa
  const getColorEtapa = (etapa: string) => {
    switch (etapa) {
      case "1":
        return "blue";
      case "2":
        return "green";
      default:
        return "default";
    }
  };

  // Función para obtener el nombre de la etapa
  const getNombreEtapa = (etapa: string) => {
    switch (etapa) {
      case "1":
        return "Tubería";
      case "2":
        return "Acabados";
      default:
        return `Etapa ${etapa}`;
    }
  };

  const manzanasUnicas = Object.keys(data);

  return (
    <>
      <div
        style={{
          padding: "20px",
          margin: "0 auto",
          background: "linear-gradient(to bottom right, #f8f9fa, #ffffff)",
          width: "90%",
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

      {/* Modal Jerárquico Mejorado */}
      <Modal
        open={modalProcesosOpen}
        onCancel={() => {
          setModalProcesosOpen(false);
          setManzanaSeleccionada(null);
        }}
        footer={null}
        title={
          <div>
            <Title level={4} style={{ margin: 0 }}>
              📊 Detalle de Manzana:{" "}
              {manzanaSeleccionada
                ? porcetanjeManzana[manzanaSeleccionada]?.nombre_manzana ||
                  `Manzana ${manzanaSeleccionada}`
                : "Manzana"}
            </Title>
            <Text type="secondary">
              Proyecto: {infoProyecto?.descripcion_proyecto}
            </Text>
          </div>
        }
        centered
        width={800}
        style={{ maxHeight: "80vh" }}
      >
        {manzanaSeleccionada && (
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {/* Resumen de la Manzana */}
            <Card
              size="small"
              style={{ marginBottom: 16, background: "#f8f9fa" }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="Total Procesos"
                    value={
                      porcetanjeManzana[manzanaSeleccionada]?.total_general || 0
                    }
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Completados"
                    value={
                      porcetanjeManzana[manzanaSeleccionada]
                        ?.total_realizados || 0
                    }
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="% Avance"
                    value={
                      porcetanjeManzana[manzanaSeleccionada]
                        ?.porcentaje_avance || 0
                    }
                    suffix="%"
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="% Atraso"
                    value={
                      porcetanjeManzana[manzanaSeleccionada]
                        ?.porcentaje_atraso || 0
                    }
                    suffix="%"
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Col>
              </Row>
            </Card>

            <Collapse accordion>
              {Object.entries(data[manzanaSeleccionada] || {}).map(
                ([casaKey, casaContenido]: any) => {
                  const casaId = `${manzanaSeleccionada}-${casaKey}`;
                  const resumenCasa = casaResumen[casaId];

                  return (
                    <Panel
                      key={casaKey}
                      header={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <div>
                            <Text strong style={{ fontSize: "16px" }}>
                              🏠 Casa {casaContenido.consecutivo}
                            </Text>
                          </div>
                          <div>
                            <Tag color="blue">
                              Avance: {resumenCasa?.porcentaje_avance || 0}%
                            </Tag>
                            <Tag
                              color={
                                resumenCasa?.porcentaje_atraso > 0
                                  ? "red"
                                  : "green"
                              }
                            >
                              Atraso: {resumenCasa?.porcentaje_atraso || 0}%
                            </Tag>
                          </div>
                        </div>
                      }
                    >
                      {/* Iterar sobre todos los pisos de la casa */}
                      {Object.entries(casaContenido.pisos || {}).map(
                        ([pisoKey, etapas]: any) => (
                          <div key={pisoKey} style={{ marginBottom: "20px" }}>
                            <Divider orientation="left">
                              <Tag color="purple" style={{ fontSize: "14px" }}>
                                🏗️ Piso {pisoKey}
                              </Tag>
                            </Divider>

                            {/* Etapas del piso */}
                            {Object.entries(etapas).map(
                              ([etapaKey, procesos]: any) => (
                                <div
                                  key={etapaKey}
                                  style={{ marginBottom: "16px" }}
                                >
                                  <div style={{ marginBottom: "8px" }}>
                                    <Tag
                                      color={getColorEtapa(etapaKey)}
                                      style={{ fontSize: "12px" }}
                                    >
                                      {getNombreEtapa(etapaKey)}
                                    </Tag>
                                  </div>

                                  {/* Procesos de la etapa */}
                                  <div style={{ marginLeft: "16px" }}>
                                    {Object.entries(procesos).map(
                                      ([procesoKey, proceso]: any) => (
                                        <Card
                                          key={procesoKey}
                                          size="small"
                                          style={{
                                            marginBottom: "8px",
                                            borderLeft: `4px solid ${
                                              proceso.estado === "2"
                                                ? "#52c41a"
                                                : proceso.estado === "1"
                                                ? "#1890ff"
                                                : "#d9d9d9"
                                            }`,
                                          }}
                                          bodyStyle={{ padding: "12px" }}
                                        >
                                          <Row gutter={8} align="middle">
                                            <Col span={16}>
                                              <Text
                                                strong
                                                style={{ fontSize: "14px" }}
                                              >
                                                {proceso.nombre_proceso}
                                              </Text>
                                              {proceso.text_validacion && (
                                                <div>
                                                  <Text
                                                    type="secondary"
                                                    style={{ fontSize: "12px" }}
                                                  >
                                                    📝 {proceso.text_validacion}
                                                  </Text>
                                                </div>
                                              )}
                                              {proceso.usuario && (
                                                <div>
                                                  <Text
                                                    type="secondary"
                                                    style={{ fontSize: "12px" }}
                                                  >
                                                    👤 {proceso.usuario}
                                                  </Text>
                                                </div>
                                              )}
                                            </Col>
                                            <Col
                                              span={8}
                                              style={{ textAlign: "right" }}
                                            >
                                              <Tag
                                                color={getColorEstado(
                                                  proceso.estado
                                                )}
                                                style={{ margin: 0 }}
                                              >
                                                {getTextoEstado(proceso.estado)}
                                              </Tag>
                                              {proceso.validacion === 1 && (
                                                <div
                                                  style={{ marginTop: "4px" }}
                                                >
                                                  <Tag
                                                    color={
                                                      proceso.estado_validacion ===
                                                      1
                                                        ? "green"
                                                        : "orange"
                                                    }
                                                    size="small"
                                                  >
                                                    {proceso.estado_validacion ===
                                                    1
                                                      ? "✅ Validado"
                                                      : "⏳ Pendiente"}
                                                  </Tag>
                                                </div>
                                              )}
                                            </Col>
                                          </Row>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )
                      )}
                    </Panel>
                  );
                }
              )}
            </Collapse>
          </div>
        )}
      </Modal>
    </>
  );
};
