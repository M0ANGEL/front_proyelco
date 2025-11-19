import {
  Card,
  Select,
  Typography,
  Button,
  Row,
  Col,
  Modal,
  Tag,
  Divider,
  Alert,
  Collapse,
  Space,
  Statistic,
} from "antd";
import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeftOutlined, FilterOutlined } from "@ant-design/icons";
import { detalleCasa } from "@/services/proyectos/casasProyectosAPI";
import { ModalInfoCassas } from "./ModalInfoCassas";
import { Apartment } from "@/types/typesGlobal";

const { Title, Text } = Typography;

export const VistaProcesoCasa = () => {
  // 📌 Recibimos los datos que envía ResumenManzanas
  const { state } = useLocation();
  const { data, porcetanjeManzana, infoProyecto, id, manzana, casaResumen } =
    state || {};

  const [manzanaSeleccionada, setManzanaSeleccionada] = useState<string | null>(
    manzana
  );
  const [filtroProceso, setFiltroProceso] = useState("");
  const [filtroEtapa, setFiltroEtapa] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedCasas, setSelectedCasas] = useState<Apartment | null>(null);

  const { Panel } = Collapse;

  // Modal de info de procesos
  const [modalProcesosOpen, setModalProcesosOpen] = useState(false);

  const manzanasUnicas = Object.keys(data || {});

  // Obtener todas las etapas únicas para el filtro
  const todasEtapas = useMemo(() => {
    if (!manzanaSeleccionada || !data[manzanaSeleccionada]) return [];

    const etapasSet = new Set();
    Object.values(data[manzanaSeleccionada]).forEach((casa: any) => {
      Object.values(casa.pisos || {}).forEach((piso: any) => {
        Object.keys(piso).forEach((etapaKey) => {
          etapasSet.add(etapaKey);
        });
      });
    });

    // 🔹 Diccionario de nombres de etapa
    const nombreEtapas: Record<string, string> = {
      "1": "Tubería",
      "2": "Acabados",
    };

    return Array.from(etapasSet).map((etapa) => ({
      label: nombreEtapas[etapa] || `Etapa ${etapa}`,
      value: etapa,
    }));
  }, [manzanaSeleccionada, data]);

  // Obtener procesos únicos para la etapa seleccionada
  const procesosPorEtapa = useMemo(() => {
    if (!manzanaSeleccionada || !data[manzanaSeleccionada] || !filtroEtapa)
      return [];

    const procesosSet = new Set();
    Object.values(data[manzanaSeleccionada]).forEach((casa: any) => {
      Object.values(casa.pisos || {}).forEach((piso: any) => {
        // Solo buscar procesos en la etapa seleccionada
        if (piso[filtroEtapa]) {
          Object.values(piso[filtroEtapa]).forEach((proceso: any) => {
            procesosSet.add(proceso.nombre_proceso);
          });
        }
      });
    });

    return Array.from(procesosSet);
  }, [manzanaSeleccionada, data, filtroEtapa]);

  // Verificar si hay filtros aplicados
  const hayFiltrosAplicados = useMemo(() => {
    return filtroEtapa !== "";
  }, [filtroEtapa]);

  // Filtrar datos según el proceso y etapa seleccionados
  const datosFiltrados = useMemo(() => {
    if (!manzanaSeleccionada || !data[manzanaSeleccionada] || !filtroEtapa) {
      return {};
    }

    const casasFiltradas = { ...data[manzanaSeleccionada] };

    Object.keys(casasFiltradas).forEach((casaKey) => {
      const casa = { ...casasFiltradas[casaKey] };
      const pisosFiltrados = {};

      Object.keys(casa.pisos || {}).forEach((pisoKey) => {
        const etapasFiltradas = {};

        Object.entries(casa.pisos[pisoKey]).forEach(
          ([etapaKey, etapa]: any) => {
            // Solo procesamos la etapa seleccionada
            if (etapaKey !== filtroEtapa) return;

            const procesosFiltrados = {};

            Object.entries(etapa).forEach(([procesoId, proceso]: any) => {
              // Si hay filtro de proceso, solo mostramos procesos que coincidan
              if (!filtroProceso || proceso.nombre_proceso === filtroProceso) {
                procesosFiltrados[procesoId] = proceso;
              }
            });

            if (Object.keys(procesosFiltrados).length > 0) {
              etapasFiltradas[etapaKey] = procesosFiltrados;
            }
          }
        );

        if (Object.keys(etapasFiltradas).length > 0) {
          pisosFiltrados[pisoKey] = etapasFiltradas;
        }
      });

      casa.pisos = pisosFiltrados;
      casasFiltradas[casaKey] = casa;
    });

    return casasFiltradas;
  }, [manzanaSeleccionada, data, filtroProceso, filtroEtapa]);

  // Función para obtener el color del estado basado en el valor de la data
  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "2":
        return "green"; // Completado - Verde
      case "1":
        return "blue"; // En progreso - Azul
      case "0":
        return "default"; // Pendiente - Gris
      default:
        return "default"; // Por defecto - Gris
    }
  };

  // Función para obtener el texto del estado basado en el valor de la data
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

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroEtapa("");
    setFiltroProceso("");
  };

  // Manejar cambio de etapa
  const manejarCambioEtapa = (valor: string) => {
    setFiltroEtapa(valor);
    setFiltroProceso(""); // Resetear filtro de proceso al cambiar etapa
  };

  //consultar informe del proceso
  const handleCasaClick = async (aptId: number) => {
    setLoadingModal(true);
    setModalOpen(true);
    try {
      const { data } = await detalleCasa({ id: aptId });
      setSelectedCasas(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingModal(false);
    }
  };

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
            ID: {id} | Seleccione una manzana para gestionar
          </Text>
        </div>

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

            {/* Columna Centro: Select de Manzana */}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Seleccione una manzana"
                style={{ width: "100%" }}
                onChange={(value) => {
                  setManzanaSeleccionada(value);
                  limpiarFiltros(); // Resetear filtros al cambiar manzana
                }}
                value={manzanaSeleccionada}
                options={manzanasUnicas.map((manzana) => ({
                  label:
                    porcetanjeManzana[manzana]?.nombre_manzana ||
                    `Manzana ${manzana}`,
                  value: manzana,
                }))}
                size="large"
              />
            </Col>

            {/* Filtro por Etapa (obligatorio) */}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Seleccione una etapa*"
                style={{ width: "100%" }}
                value={filtroEtapa}
                onChange={manejarCambioEtapa}
                allowClear
                suffixIcon={<FilterOutlined />}
                size="large"
                options={todasEtapas}
                disabled={!manzanaSeleccionada}
              />
            </Col>

            {/* Filtro por Proceso (opcional) - Solo procesos de la etapa seleccionada */}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder={
                  filtroEtapa
                    ? "Filtrar por proceso (opcional)"
                    : "Primero seleccione una etapa"
                }
                style={{ width: "100%" }}
                value={filtroProceso}
                onChange={setFiltroProceso}
                allowClear
                suffixIcon={<FilterOutlined />}
                size="large"
                options={procesosPorEtapa.map((proceso: any) => ({
                  label: proceso,
                  value: proceso,
                }))}
                disabled={!manzanaSeleccionada || !filtroEtapa}
              />
            </Col>

            {/* Columna Derecha: Botones de Acción */}
            <Col xs={24} sm={12} md={8} lg={3}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {hayFiltrosAplicados && (
                  <Button onClick={limpiarFiltros} style={{ width: "100%" }}>
                    Limpiar filtros
                  </Button>
                )}
                {manzanaSeleccionada && (
                  <Button
                    type="primary"
                    onClick={() => setModalProcesosOpen(true)}
                    style={{ width: "100%" }}
                  >
                    Informe
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Mostrar contenido solo cuando hay una etapa seleccionada */}
        {hayFiltrosAplicados && (
          <div>
            {/* Resumen de filtros aplicados */}
            <Alert
              message={
                <span>
                  <Text strong>Filtros aplicados: </Text>
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    Etapa: {filtroEtapa}
                  </Tag>
                  {filtroProceso && (
                    <Tag color="green" style={{ marginLeft: 8 }}>
                      Proceso: {filtroProceso}
                    </Tag>
                  )}
                </span>
              }
              type="info"
              style={{ marginBottom: 16 }}
              closable
              onClose={limpiarFiltros}
            />

            {/* Lista de Casas - Cartas con diseño mejorado */}
            {Object.keys(datosFiltrados).length > 0 ? (
              <Row gutter={[16, 16]}>
                {Object.entries(datosFiltrados).map(
                  ([casaKey, casaContenido]: any) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={casaKey}>
                      <Card
                        style={{
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #f0f0f0",
                          background: "#ffffff",
                          height: "100%",
                          transition: "all 0.3s ease",
                        }}
                        bodyStyle={{
                          padding: "16px",
                        }}
                        hoverable
                      >
                        {/* Header de la Casa */}
                        <div
                          style={{
                            textAlign: "center",
                            marginBottom: "16px",
                            padding: "5px",
                            background:
                              "linear-gradient(135deg, #1890ff, #36cfc9)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        >
                          <Title
                            level={4}
                            style={{ margin: 0, color: "white" }}
                          >
                            Casa {casaContenido.consecutivo}
                          </Title>
                        </div>

                        {/* Pisos de la casa - Ordenados de mayor a menor (PISO 2, PISO 1) */}
                        {Object.entries(casaContenido.pisos || {})
                          .sort((a, b) => Number(b[0]) - Number(a[0]))
                          .map(([pisoKey, etapas]: any) => (
                            <div key={pisoKey} style={{ marginBottom: "20px" }}>
                              {/* Header del Piso */}
                              <div
                                style={{
                                  background: "#f5f5f5",
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  marginBottom: "12px",
                                  borderLeft: "4px solid #1890ff",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: "#595959",
                                    fontSize: "14px",
                                  }}
                                >
                                  PISO {pisoKey}
                                </Text>
                              </div>

                              {/* Etapas del piso */}
                              {Object.entries(etapas).map(
                                ([etapaKey, procesos]: any) => (
                                  <div
                                    key={etapaKey}
                                    style={{ marginBottom: "16px" }}
                                  >
                                    {/* Header de la Etapa */}
                                    <Divider
                                      orientation="left"
                                      orientationMargin="0"
                                    >
                                      <Tag
                                        color={getColorEtapa(etapaKey)}
                                        style={{
                                          fontSize: "12px",
                                          padding: "4px 8px",
                                        }}
                                      >
                                        Etapa {etapaKey}
                                      </Tag>
                                    </Divider>

                                    {/* Procesos de la etapa */}
                                    {Object.entries(procesos).map(
                                      ([procesoId, proceso]: any) => (
                                        <div
                                          key={procesoId}
                                          style={{
                                            padding: "12px",
                                            background: "#fafafa",
                                            borderRadius: "8px",
                                            marginBottom: "12px",
                                            border: "1px solid #e8e8e8",
                                          }}
                                        >
                                          {/* Nombre del proceso y estado */}
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "flex-start",
                                              marginBottom: "8px",
                                            }}
                                          >
                                            <Text
                                              strong
                                              style={{
                                                fontSize: "14px",
                                                color: "#262626",
                                              }}
                                            >
                                              {proceso.nombre_proceso}
                                            </Text>
                                            <Tag
                                              color={getColorEstado(
                                                proceso.estado
                                              )}
                                              style={{
                                                fontSize: "12px",
                                                padding: "4px 8px",
                                                margin: 0,
                                                borderRadius: "12px",
                                              }}
                                              onClick={() =>
                                                handleCasaClick(proceso.id)
                                              }
                                            >
                                              {getTextoEstado(proceso.estado)}
                                            </Tag>
                                          </div>

                                          {/* Información adicional */}
                                          <div
                                            style={{
                                              borderTop: "1px dashed #e8e8e8",
                                              paddingTop: "8px",
                                            }}
                                          >
                                            {proceso.text_validacion && (
                                              <Text
                                                type="secondary"
                                                style={{
                                                  fontSize: "12px",
                                                  display: "block",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                ❓ {proceso.text_validacion}
                                              </Text>
                                            )}

                                            {/* Mostrar información de validación si existe */}
                                            {proceso.validacion === 1 && (
                                              <Text
                                                type="secondary"
                                                style={{
                                                  fontSize: "12px",
                                                  display: "block",
                                                }}
                                              >
                                                {proceso.estado_validacion === 1
                                                  ? "✅ Validado"
                                                  : "⏳ Pendiente validación"}
                                              </Text>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                      </Card>
                    </Col>
                  )
                )}
              </Row>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "12px",
                  border: "2px dashed #d9d9d9",
                }}
              >
                <Title
                  level={4}
                  style={{ color: "#8c8c8c", marginBottom: "16px" }}
                >
                  No se encontraron resultados para los filtros aplicados
                </Title>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: "16px" }}
                >
                  {filtroProceso
                    ? `No hay procesos "${filtroProceso}" en la etapa ${filtroEtapa}`
                    : `No hay procesos en la etapa ${filtroEtapa}`}
                </Text>
                <Button
                  type="primary"
                  onClick={limpiarFiltros}
                  style={{ marginTop: "16px" }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Mensaje cuando no hay filtros aplicados */}
        {!hayFiltrosAplicados && manzanaSeleccionada && (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "12px",
              border: "2px dashed #d9d9d9",
            }}
          >
            <Title level={4} style={{ color: "#8c8c8c", marginBottom: "16px" }}>
              Seleccione una etapa para visualizar los procesos
            </Title>
            <Text
              type="secondary"
              style={{
                fontSize: "16px",
                display: "block",
                marginBottom: "16px",
              }}
            >
              El filtro de etapa es obligatorio para mostrar la información
            </Text>
            <div style={{ marginTop: 24 }}>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Opciones de filtrado:
              </Text>
              <div
                style={{ textAlign: "left", maxWidth: 400, margin: "0 auto" }}
              >
                <ul>
                  <li>Seleccione una etapa para ver todos sus procesos</li>
                  <li>
                    Luego puede filtrar adicionalmente por un proceso específico
                    de esa etapa
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay manzana seleccionada */}
        {!manzanaSeleccionada && (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "12px",
              border: "2px dashed #d9d9d9",
            }}
          >
            <Title level={4} style={{ color: "#8c8c8c", marginBottom: "16px" }}>
              Seleccione una manzana para visualizar la información
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Use el menú desplegable de "Seleccione una manzana" para comenzar
            </Text>
          </div>
        )}
      </div>

      {/* info del proceso */}
      <ModalInfoCassas
        isOpen={modalOpen}
        loading={loadingModal}
        onClose={() => setModalOpen(false)}
        selectedApt={selectedCasas}
      />

      {/* Modal de Informe Mejorado */}
      <Modal
        open={modalProcesosOpen}
        onCancel={() => setModalProcesosOpen(false)}
        footer={null}
        title={
          <div>
            <Title level={4} style={{ margin: 0 }}>
              📊 Informe Completo:{" "}
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
                  const resumenCasa = casaResumen?.[casaId];

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
