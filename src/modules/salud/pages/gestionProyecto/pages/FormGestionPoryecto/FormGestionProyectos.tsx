import {
  Card,
  Spin,
  Select,
  Typography,
  Button,
  Tooltip,
  Row,
  Col,
  Popconfirm,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  cambioestadoAptAnulacion,
  getProyectoDetalleGestion,
  InfoProyecto,
} from "@/services/proyectos/gestionProyectoAPI";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import ModalAnulacion from "../components/ModalAnulacion";

const { Title, Text } = Typography;

export const FormGestionProyectos = () => {
  const [data, setData] = useState<any>({});
  const [porcetanjeTorre, setPorcetanjeTorre] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [torreSeleccionada, setTorreSeleccionada] = useState<string | null>(
    null
  );
  const [infoProyecto, setInfoProyecto] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [aptSeleccionado, setAptSeleccionado] = useState<{
    id: string;
    orden: number;
    consecutivo: number;
    proceso: string;
  } | null>(null);

  const { id } = useParams<{ id: string }>();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    LlamadoData();
    InfoProyecto(Number(id)).then(({ data: { data } }) => {
      setInfoProyecto(data);
    });
  }, [id]);

  const LlamadoData = () => {
    setLoading(true);
    getProyectoDetalleGestion(Number(id)).then(({ data }) => {
      setData(data.data);
      setPorcetanjeTorre(data.torreResumen);
      setLoading(false);
    });
  };

  const torreYaIniciada = () => {
    if (!torreSeleccionada) return false;

    const procesos = data[torreSeleccionada];
    if (!procesos) return false;

    const primerProcesoKey = Object.keys(procesos)[0];
    const primerProceso = procesos[primerProcesoKey];

    if (!primerProceso?.pisos) return false;

    for (const piso of Object.values(primerProceso.pisos)) {
      const aptos = piso as any[];
      if (aptos.some((apto) => apto.estado !== "0")) {
        return true;
      }
    }

    return false;
  };

  const AnularPiso = (
    aptId: string,
    ordenProceso: number,
    consecutivo: number,
    proceso: string
  ) => {
    setAptSeleccionado({
      id: aptId,
      orden: ordenProceso,
      consecutivo,
      proceso,
    });
    setModalVisible(true);
  };

  const EnvioAnulacion = (detalle: string) => {
    setLoading(true);
    if (!aptSeleccionado) return;

    const datos = {
      aptId: aptSeleccionado.id,
      ordenProceso: aptSeleccionado.orden,
      detalle,
    };

    cambioestadoAptAnulacion(datos)
      .then(() => {
        notification.success({
          message: "El cambio de estado fue realizado",
          placement: "topRight",
          duration: 2,
        });
      })
      .catch((err) => {
        notification.success({
          message: "El cambio de estado fue realizado" + err,
          placement: "topRight",
          duration: 2,
        });
      })
      .finally(() => {
        setLoading(false);
        LlamadoData();
      });

    setModalVisible(false);
    setAptSeleccionado(null);
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
        <Link to=".." relative="path">
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
              <Col>
                <Button
                  type="primary"
                  size="large"
                  disabled={
                    !torreSeleccionada ||
                    torreYaIniciada() ||
                    !["Encargado Obras"].includes(user_rol)
                  }
                  style={{
                    background: torreYaIniciada() ? "#52c41a" : "#1890ff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                    boxShadow: "0 2px 8px rgba(24, 144, 255, 0.2)",
                    height: "40px",
                    padding: "0 24px",
                  }}
                >
                  {torreYaIniciada() ? "Torre Iniciada" : "Iniciar Torre"}
                </Button>
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
                                {contenido.total_apartamentos}{" "}
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
                            background: "rgba(226, 226, 226, 0.8)",
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
                                    marginBottom: "10px",
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
                                  {aptos.map((apt: any) => (
                                    <Tooltip
                                      key={apt.id}
                                      title={
                                        apt.estado === "2"
                                          ? "Apartamento Confirmado"
                                          : apt.estado === "1"
                                          ? "Apartamento Habilitado"
                                          : "Apartamento no habilitado"
                                      }
                                    >
                                      {apt.estado === "2" ? (
                                        <Popconfirm
                                          disabled={
                                            !["Ingeniero Obra"].includes(
                                              user_rol
                                            )
                                          }
                                          title="¿Estás seguro de que deseas anular este APT?"
                                          onConfirm={() =>
                                            AnularPiso(
                                              apt.id,
                                              contenido.orden_proceso,
                                              apt.consecutivo,
                                              contenido.nombre_proceso
                                            )
                                          }
                                          okText="Sí"
                                          cancelText="No"
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
                                              background:
                                                apt.estado === "2"
                                                  ? "linear-gradient(135deg, #4caf50, #66bb6a)"
                                                  : "linear-gradient(135deg,rgb(0, 0, 0),rgb(54, 54, 54))",
                                              color: "white",
                                              fontWeight: 500,
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              cursor: "pointer",
                                              position: "relative",
                                            }}
                                          >
                                            {apt.consecutivo}
                                          </Button>
                                        </Popconfirm>
                                      ) : (
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
                                            background:
                                              apt.estado === "1"
                                                ? "linear-gradient(135deg, #1890ff, #36cfc9)"
                                                : "linear-gradient(135deg,rgb(0, 0, 0),rgb(54, 54, 54))",
                                            color: "white",
                                            fontWeight: 500,
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "default",
                                            position: "relative",
                                          }}
                                          disabled
                                        >
                                          {apt.consecutivo}
                                        </Button>
                                      )}
                                    </Tooltip>
                                  ))}
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

      <ModalAnulacion
        visible={modalVisible}
        infoApt={aptSeleccionado}
        onConfirm={EnvioAnulacion}
        onCancel={() => {
          setModalVisible(false);
          setAptSeleccionado(null);
        }}
      />
    </div>
  );
};
