import {
  Card,
  Spin,
  Select,
  Typography,
  Button,
  Tooltip,
  Row,
  Col,
  Progress,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ModalInfoApt } from "./ModalInfoAPt";
import { Apartment } from "@/types/typesGlobal";
import { detalleApt } from "@/services/proyectos/proyectosAPI";
import AnalicisIAProyectos from "../AnalicisIA/AnalicisIAProyectos";

const { Title, Text } = Typography;

export const VistaProcesoProyectos = () => {
  // 📌 Recibimos los datos que envía ResumenTorres
  const { state } = useLocation();
  const { data, porcetanjeTorre, infoProyecto, id, torre } = state || {};

  const [torreSeleccionada, setTorreSeleccionada] = useState<string | null>(
    torre
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Apartment | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  //modal de info de proceos
  const [modalProcesosOpen, setModalProcesosOpen] = useState(false);

  const handleAptClick = async (aptId: number) => {
    setLoadingModal(true);
    setModalOpen(true);
    try {
      const { data } = await detalleApt({ id: aptId });
      setSelectedApt(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingModal(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const torresUnicas = Object.keys(data || {});

  // Función para preparar datos de la torre seleccionada
  const prepareTorreDataForAI = () => {
    if (!data || !torreSeleccionada || !porcetanjeTorre) return null;

    const torreData = data[torreSeleccionada];
    const torreInfo = porcetanjeTorre[torreSeleccionada];

    if (!torreData) return null;

    const dataForAI = {
      proyecto: {
        id: id,
        nombre: infoProyecto?.descripcion_proyecto || "Sin nombre",
        torre_analizada: torreSeleccionada,
      },
      torre: {
        nombre: torreInfo?.nombre_torre || `Torre ${torreSeleccionada}`,
        porcentaje_retraso: torreInfo?.porcentaje_atraso || 0,
        estado_general: "",
        procesos: {},
      },
      estadisticas: {
        total_procesos: 0,
        procesos_con_retraso: 0,
        procesos_sin_avance: 0,
        procesos_completados: 0,
        porcentaje_promedio_avance: 0,
      },
    };

    // Procesar cada proceso de la torre
    const procesos = Object.entries(torreData);
    dataForAI.torre.estado_general =
      procesos.length > 0 ? "Activa" : "Sin datos";

    let totalAvance = 0;
    let procesosAnalizados = 0;

    procesos.forEach(([procesoKey, procesoData]: [string, any]) => {
      if (!procesoData) return;

      // Calcular avance del proceso
      const totalApt = procesoData.total_apartamentos || 0;
      const aptRealizados = procesoData.apartamentos_realizados || 0;
      const porcentajeAvance =
        totalApt > 0 ? (aptRealizados / totalApt) * 100 : 0;

      // Determinar estado del proceso
      let estadoProceso = "Sin avance";
      if (porcentajeAvance === 100) estadoProceso = "Completado";
      else if (porcentajeAvance >= 70) estadoProceso = "Avanzado";
      else if (porcentajeAvance >= 30) estadoProceso = "En progreso";
      else if (porcentajeAvance > 0) estadoProceso = "Iniciado";

      // Actualizar estadísticas
      dataForAI.estadisticas.total_procesos++;
      if (procesoData.porcentaje_atraso > 15) {
        dataForAI.estadisticas.procesos_con_retraso++;
      }
      if (porcentajeAvance === 0) {
        dataForAI.estadisticas.procesos_sin_avance++;
      }
      if (porcentajeAvance === 100) {
        dataForAI.estadisticas.procesos_completados++;
      }

      totalAvance += porcentajeAvance;
      procesosAnalizados++;

      // Agregar datos del proceso
      dataForAI.torre.procesos[procesoKey] = {
        nombre: procesoData.nombre_proceso || `Proceso ${procesoKey}`,
        porcentaje_avance: porcentajeAvance.toFixed(2),
        porcentaje_retraso: procesoData.porcentaje_atraso || 0,
        apartamentos_realizados: aptRealizados,
        total_apartamentos: totalApt,
        serial_avance: `${aptRealizados}/${totalApt}`,
        estado: estadoProceso,
        necesita_validacion: procesoData.validacion === 1,
        estado_validacion:
          procesoData.estado_validacion === 1 ? "Validado" : "Pendiente",
      };
    });

    // Calcular promedio de avance
    if (procesosAnalizados > 0) {
      dataForAI.estadisticas.porcentaje_promedio_avance = (
        totalAvance / procesosAnalizados
      ).toFixed(2);
    }

    // Determinar estado general basado en retraso
    const retrasoTorre = dataForAI.torre.porcentaje_retraso;
    if (retrasoTorre < 10) {
      dataForAI.torre.estado_general = "En buen progreso";
    } else if (retrasoTorre < 30) {
      dataForAI.torre.estado_general = "Retraso moderado";
    } else if (retrasoTorre >= 30) {
      dataForAI.torre.estado_general = "Crítico";
    }

    return dataForAI;
  };

  // Luego en tu componente:
  const dataForAI = prepareTorreDataForAI();

  return (
    <>
      {loading ? (
        <>
          <>
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" tip="Cargando proyectos..." />
            </div>
          </>
        </>
      ) : (
        <>
          <div
            style={{
              padding: "20px",
              margin: "0 auto",
              background: "linear-gradient(to bottom right, #f8f9fa, #ffffff)",
              width: "90%",
            }}
          >
            {/* Header Section */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(8px)",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                marginBottom: "32px",
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
                ID: {id} | Seleccione una torre para gestionar
              </Text>
            </div>

            {/* En la sección donde quieres mostrar el análisis de IA */}
            {torreSeleccionada && dataForAI && (
              <div style={{ marginBottom: "24px" }}>
                <AnalicisIAProyectos
                  data={dataForAI}
                  tituloPersonalizado={`Análisis de ${
                    porcetanjeTorre[torreSeleccionada]?.nombre_torre ||
                    `Torre ${torreSeleccionada}`
                  }`}
                />
              </div>
            )}

            {/* Card Principal con Botones Anclados */}
            <Card
              style={{
                marginBottom: "32px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                border: "none",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(8px)",
                position: "sticky",
                top: 60,
                zIndex: 100,
              }}
            >
              <Row gutter={[16, 16]} align="middle" justify="space-between">
                {/* Columna Izquierda: Botón Volver */}
                <Col xs={24} sm={6} md={4} lg={3}>
                  <Link to=".." relative="path">
                    <Button
                      danger
                      type="primary"
                      icon={<ArrowLeftOutlined />}
                      style={{ width: "100%" }}
                    >
                      Volver
                    </Button>
                  </Link>
                </Col>

                {/* Columna Centro: Select de Torre */}
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Select
                    placeholder="Seleccione una torre"
                    style={{ width: "100%" }}
                    onChange={setTorreSeleccionada}
                    value={torreSeleccionada}
                    options={torresUnicas.map((torre) => ({
                      label:
                        porcetanjeTorre[torre]?.nombre_torre ||
                        `Torre ${torre}`,
                      value: torre,
                    }))}
                    size="large"
                  />
                </Col>

                {/* Columna Derecha: Botón Ver Procesos */}
                <Col xs={24} sm={6} md={4} lg={3}>
                  {torreSeleccionada && (
                    <Button
                      type="primary"
                      onClick={() => setModalProcesosOpen(true)}
                      style={{ width: "100%" }}
                    >
                      Informe
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>

            {/* Render procesos de la torre */}
            {torreSeleccionada && (
              <div>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(8px)",
                    padding: "16px 24px",
                    borderRadius: "12px",
                    marginBottom: "24px",
                    display: "inline-block",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      color: "#1a1a1a",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "6px",
                        height: "24px",
                        background:
                          "linear-gradient(to bottom, #ff7c5c, #ff9a3c)",
                        borderRadius: "3px",
                      }}
                    ></span>
                    Torre:{" "}
                    {porcetanjeTorre[torreSeleccionada]?.nombre_torre ||
                      `Torre ${torreSeleccionada}`}
                  </Title>
                  <span style={{ color: "blue" }}>
                    <b>
                      Atraso de Torre:{" "}
                      {porcetanjeTorre[torreSeleccionada]?.porcentaje_atraso} %
                    </b>
                  </span>
                </div>

                <Row gutter={[24, 24]}>
                  {Object.entries(data[torreSeleccionada] || {}).map(
                    ([procesoKey, contenido]: any) => {
                      const necesitaValidacion = contenido.validacion === 1;
                      const estaValidado = contenido.estado_validacion === 1;

                      return (
                        <Col
                          xs={24}
                          sm={24}
                          md={12}
                          lg={12}
                          xl={12}
                          key={procesoKey}
                        >
                          <Card
                            title={
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{ fontWeight: 500, color: "#1a1a1a" }}
                                >
                                  {procesoKey} -{" "}
                                  {contenido.nombre_proceso || "Proceso"}
                                </span>
                                <span style={{ color: "blue" }}>
                                  {contenido.apartamentos_realizados} /{" "}
                                  {contenido.total_apartamentos}
                                </span>
                                <span style={{ color: "blue" }}>
                                  Atraso del proceso:{" "}
                                  {contenido.porcentaje_atraso}%
                                </span>
                              </div>
                            }
                            style={{
                              borderRadius: "16px",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                              border: "none",
                              background: "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(8px)",
                              height: "100%",
                            }}
                            headStyle={{
                              borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                              padding: "16px 24px",
                            }}
                            bodyStyle={{
                              padding: "16px 24px",
                            }}
                          >
                            {Object.entries(contenido.pisos || {})
                              .sort((a, b) => Number(b[0]) - Number(a[0]))
                              .map(([piso, aptos]: any) => (
                                <div
                                  key={piso}
                                  style={{ marginBottom: "20px" }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      display: "block",
                                      marginBottom: "12px",
                                      color: "#595959",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Piso {piso}
                                  </Text>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "8px",
                                    }}
                                  >
                                    {aptos.map((apt: any) => {
                                      const getTooltipTitle = () => {
                                        if (apt.estado === "2")
                                          return "Apt Confirmado para este proceso";
                                        if (apt.estado === "1")
                                          return "Apartamento Habilitado";
                                        return "Apartamento no habilitado";
                                      };

                                      // const getBackgroundColor = () => {
                                      //   if (apt.estado === "1")
                                      //     return "linear-gradient(135deg, #1890ff, #36cfc9)";
                                      //   if (apt.estado === "2")
                                      //     return "linear-gradient(135deg, #4caf50, #66bb6a)";
                                      //   return "linear-gradient(135deg,rgb(0, 0, 0),rgb(54, 54, 54))";
                                      // };
                                      const getBackgroundColor = () => {
                                        if (apt.eb == true) {
                                          return "linear-gradient(135deg, #008cff8a, #a8a8a8ff)";
                                        } else {
                                          if (apt.estado === "1")
                                            return "linear-gradient(135deg, #1890ff, #36cfc9)";
                                          if (apt.estado === "2")
                                            return "linear-gradient(135deg, #4caf50, #66bb6a)";
                                          return "linear-gradient(135deg,rgb(0, 0, 0),rgb(54, 54, 54))";
                                        }
                                      };

                                      const opacity =
                                        apt.estado === "0" ? 0.6 : 1;

                                      return (
                                        <Tooltip
                                          key={apt.id}
                                          title={getTooltipTitle()}
                                        >
                                          <Button
                                            style={{
                                              width: "60px",
                                              height: "36px",
                                              padding: 0,
                                              borderRadius: "6px",
                                              border: "none",
                                              background: getBackgroundColor(),
                                              color: "white",
                                              fontWeight: 500,
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              opacity,
                                              position: "relative",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleAptClick(apt.id)
                                            }
                                          >
                                            {apt.consecutivo}
                                            {necesitaValidacion &&
                                              !estaValidado && (
                                                <span
                                                  style={{
                                                    position: "absolute",
                                                    top: -2,
                                                    right: -2,
                                                    background: "#ff4d4f",
                                                    borderRadius: "50%",
                                                    width: 8,
                                                    height: 8,
                                                    border: "2px solid #fff",
                                                  }}
                                                />
                                              )}
                                          </Button>
                                        </Tooltip>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                          </Card>
                        </Col>
                      );
                    }
                  )}
                </Row>
              </div>
            )}
          </div>
        </>
      )}

      <ModalInfoApt
        isOpen={modalOpen}
        loading={loadingModal}
        onClose={() => setModalOpen(false)}
        selectedApt={selectedApt}
      />

      {/* modal del procesos*/}
      <Modal
        open={modalProcesosOpen}
        onCancel={() => setModalProcesosOpen(false)}
        footer={null}
        title={`Procesos de ${
          porcetanjeTorre[torreSeleccionada!]?.nombre_torre || "Torre"
        }`}
        centered
        width={700}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {torreSeleccionada &&
            Object.entries(data[torreSeleccionada] || {}).map(
              ([procesoKey, contenido]: any) => (
                <div
                  key={procesoKey}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "rgba(245,245,245,0.8)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ minWidth: "180px", fontWeight: 500 }}>
                    {contenido.nombre_proceso}
                  </div>
                  <Progress
                    percent={contenido.porcentaje_atraso}
                    status="active"
                    strokeColor={
                      contenido.porcentaje_atraso < 15
                        ? "#1890ff"
                        : contenido.porcentaje_atraso < 30
                        ? "#faad14"
                        : "#cf1322"
                    }
                    style={{ flex: 1 }}
                  />
                </div>
              )
            )}
        </div>
      </Modal>
    </>
  );
};
