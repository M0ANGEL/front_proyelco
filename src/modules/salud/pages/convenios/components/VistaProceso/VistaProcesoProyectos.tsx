import {
  Card,
  Spin,
  Select,
  Typography,
  Button,
  Tooltip,
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProyectoDetalleGestion,
  InfoProyecto,
} from "@/services/proyectos/gestionProyectoAPI";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const VistaProcesoProyectos = () => {
  const [data, setData] = useState<any>({});
  const [porcetanjeTorre, setPorcetanjeTorre] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [torreSeleccionada, setTorreSeleccionada] = useState<string | null>(
    null
  );
  const [infoProyecto, setInfoProyecto] = useState<any>({});
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    LlamadoData();
    InfoProyecto(Number(id)).then(({ data: { data } }) => {
      setInfoProyecto(data);
    });
  }, [id]);

  const LlamadoData = () => {
    setLoading(true);
    getProyectoDetalleGestion(Number(id)).then(({ data /* : { data }  */ }) => {
      setData(data.data);
      setPorcetanjeTorre(data.torreResumen);
      setLoading(false);
    });
  };

  const torresUnicas = Object.keys(data);

  return (
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
          {/* Tower Selection Card */}
          <Card
            style={{
              marginBottom: "32px",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              border: "none",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                {/* <Select
                  placeholder="Seleccione una torre"
                  style={{ width: "100%" }}
                  onChange={setTorreSeleccionada}
                  value={torreSeleccionada}
                  options={torresUnicas.map((torre) => ({
                    label: `Torre ${torre}`,
                    value: torre,
                  }))}
                  size="large"
                /> */}
                <Select
                  placeholder="Seleccione una torre"
                  style={{ width: "100%" }}
                  onChange={setTorreSeleccionada}
                  value={torreSeleccionada}
                  options={torresUnicas.map((torre) => ({
                    label:
                      porcetanjeTorre[torre]?.nombre_torre || `Torre ${torre}`,
                    value: torre,
                  }))}
                  size="large"
                />
              </Col>
            </Row>
          </Card>

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
                  {/* Torre {torreSeleccionada} */}
                  Torre:{" "}
                  {porcetanjeTorre[torreSeleccionada]?.nombre_torre ||
                    `Torre ${torreSeleccionada}`}
                </Title>
                <span style={{ color: "blue" }}>
                  {" "}
                  <b>
                    Atraso de Torre:{" "}
                    {porcetanjeTorre[torreSeleccionada]?.porcentaje_atraso} %
                  </b>{" "}
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
                              <div key={piso} style={{ marginBottom: "20px" }}>
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

                                    const getBackgroundColor = () => {
                                      if (apt.estado === "1")
                                        return "linear-gradient(135deg, #1890ff, #36cfc9)";
                                      if (apt.estado === "2")
                                        return "linear-gradient(135deg, #4caf50, #66bb6a)";
                                      return "linear-gradient(135deg, #f0f0f0, #d9d9d9)";
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
                                            width: "60px", // o el ancho que tú desees
                                            height: "36px",
                                            padding: 0,
                                            // minWidth: "40px",
                                            // height: "32px",
                                            // padding: "0 8px",
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
                                            cursor: "default",
                                            opacity,
                                            position: "relative",
                                          }}
                                          disabled
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
        </>
      )}
    </div>
  );
};
