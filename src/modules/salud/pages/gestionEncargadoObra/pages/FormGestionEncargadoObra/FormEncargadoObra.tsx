import {
  Card,
  Spin,
  Select,
  Typography,
  Button,
  Tooltip,
  notification,
  Row,
  Col,
  Modal,
  Popconfirm,
  Empty,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  confirmarAptGestion,
  getProyectoDetalleGestion,
  InfoProyecto,
  IniciarTorre,
  confirmarValidacionApt,
} from "@/services/proyectos/gestionProyectoAPI";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import { AiOutlineCheckCircle } from "react-icons/ai";

const { Title, Text } = Typography;

export const FormEncargadoObra = () => {
  const [data, setData] = useState<any>({});
  const [porcetanjeTorre, setPorcetanjeTorre] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [torreSeleccionada, setTorreSeleccionada] = useState<string | null>(
    null
  );
  const [procesoSeleccionado, setProcesoSeleccionado] = useState<string | null>(
    null
  );
  const [infoProyecto, setInfoProyecto] = useState<any>({});
  const [cantidadPisos, setCantidadPisos] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [procesoAValidar, setProcesoAValidar] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  const [pisoSeleccionado, setPisoSeleccionado] = useState(null);

  useEffect(() => {
    LlamadoData();
    InfoProyecto(Number(id)).then(({ data: { data } }) => {
      setInfoProyecto(data);
    });
  }, [id]);

  // Resetear proceso seleccionado cuando cambia la torre
  useEffect(() => {
    setProcesoSeleccionado(null);
  }, [torreSeleccionada]);

  const LlamadoData = () => {
    setLoading(true);
    getProyectoDetalleGestion(Number(id)).then(({ data }) => {
      setData(data.data);
      setPorcetanjeTorre(data.torreResumen);
      setCantidadPisos(data.torreResumen);
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

  const iniciarTorre = async () => {
    if (!torreSeleccionada) {
      notification.error({
        message: "Debes seleccionar una torre antes de iniciar.",
        placement: "topRight",
      });
      return;
    }

    if (torreYaIniciada()) {
      notification.error({
        message:
          "Esta torre ya ha sido iniciada (tiene apartamentos confirmados o habilitados).",
        placement: "topRight",
      });
      return;
    }

    const dataIniciarTorre = {
      proyecto: id,
      torre: torreSeleccionada,
    };

    try {
      await IniciarTorre(dataIniciarTorre);
      notification.success({
        message: "Torre iniciada exitosamente",
        placement: "topRight",
      });
    } catch (error: any) {
      notification.error({
        message: "Error al iniciar torre",
        description: error?.response?.data?.message || error.message,
        placement: "topRight",
      });
    } finally {
      LlamadoData();
    }
  };

  const confirmarApt = async (aptId: string, ordenProceso: number) => {
    try {
      const response = await confirmarAptGestion(aptId);

      if (response.data.needs_validation) {
        const proceso = torreSeleccionada
          ? Object.values(data[torreSeleccionada] || {}).find(
              (p: any) =>
                p.orden_proceso === (response.data.next_process || ordenProceso)
            )
          : undefined;

        if (proceso) {
          setProcesoAValidar({
            ...proceso,
            orden_proceso: response.data.next_process || ordenProceso,
          });
          setModalVisible(true);
        }
      } else {
        notification.success({
          message: "Apartamento confirmado",
          placement: "topRight",
          duration: 4,
        });
      }
      LlamadoData();
    } catch (error: any) {
      notification.error({
        message: "Error al confirmar apartamento",
        description: error.response.data.message,
        placement: "topRight",
        duration: 4,
      });
    }
  };

  // const confirmarPisosDia = async () => {
  //   try {
  //     const response = await confirmarPisosXDia({
  //       proyecto_id: infoProyecto.id,
  //       torre: torreSeleccionada,
  //     });

  //     notification.success({
  //       message: response.data.message,
  //       placement: "topRight",
  //       duration: 2,
  //     });
  //   } catch (error: any) {
  //     notification.error({
  //       message: "Error al validar pisos por dia",
  //       description: error.response.data.message,
  //       placement: "topRight",
  //       duration: 3,
  //     });
  //   } finally {
  //     LlamadoData();
  //   }
  // };

  const handleValidarProceso = async () => {
    if (!procesoAValidar || !torreSeleccionada) return;

    try {
      const response = await confirmarValidacionApt({
        torre: torreSeleccionada,
        orden_proceso: procesoAValidar.orden_proceso,
        proyecto: infoProyecto.id,
        piso: pisoSeleccionado,
      });

      if (response.status) {
        notification.success({
          message: "Proceso validado exitosamente",
          placement: "topRight",
          duration: 5,
        });
        setModalVisible(false);
        LlamadoData();
      } else {
        notification.error({
          message: response.data.message,
          placement: "topRight",
          duration: 12,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error al validar proceso",
        description: error.response.data.message,
        placement: "topRight",
        duration: 12,
      });
    }
  };

  const OpcionesValidacion = [];

  if (cantidadPisos[torreSeleccionada ? torreSeleccionada : 1]) {
    const totalPisos =
      cantidadPisos[torreSeleccionada ? torreSeleccionada : 1].total_pisos;

    for (let i = 1; i <= totalPisos; i++) {
      OpcionesValidacion.push({
        label: `Piso ${i}`,
        value: i,
      });
    }
  }

  const torresUnicas = Object.keys(data);
  const procesosDeTorre = torreSeleccionada
    ? Object.entries(data[torreSeleccionada] || {})
    : [];

  // Función para filtrar APTs con estado 1 o 2
  const filtrarApts = (pisos: any) => {
    const pisosFiltrados: any = {};

    Object.entries(pisos || {}).forEach(([piso, aptos]: any) => {
      const aptosFiltrados = aptos.filter(
        (apt: any) => apt.estado === "1" || apt.estado === "2"
      );
      if (aptosFiltrados.length > 0) {
        pisosFiltrados[piso] = aptosFiltrados;
      }
    });

    return pisosFiltrados;
  };

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
              {torreSeleccionada && (
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Select
                    placeholder="Seleccione un proceso"
                    style={{ width: "100%" }}
                    onChange={setProcesoSeleccionado}
                    value={procesoSeleccionado}
                    options={procesosDeTorre.map(([key, proceso]: any) => ({
                      label: `${key} - ${proceso.nombre_proceso}`,
                      value: key,
                    }))}
                    size="large"
                  />
                </Col>
              )}
              <Col>
                <Button
                  type="primary"
                  size="large"
                  onClick={iniciarTorre}
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
                </span>{" "}
                <br />
                <span style={{ color: "red" }}>
                  {" "}
                  <b>
                    Cantidad de pisos:{"  "}
                    {cantidadPisos[torreSeleccionada]?.total_pisos}
                  </b>{" "}
                </span>
              </div>

              {procesoSeleccionado ? (
                <Row gutter={[24, 24]}>
                  {procesosDeTorre
                    .filter(
                      ([procesoKey]) => procesoKey === procesoSeleccionado
                    )
                    .map(([procesoKey, contenido]: any) => {
                      const necesitaValidacion =
                        Number(contenido.validacion) === 1;
                      const estaValidado =
                        Number(contenido.estado_validacion) === 1;

                      // Filtrar pisos que tienen APTs con estado 1 o 2
                      const pisosFiltrados = filtrarApts(contenido.pisos);

                      // Verificar si hay APTs disponibles
                      const hayAptsDisponibles =
                        Object.keys(pisosFiltrados).length > 0;

                      return (
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
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
                            extra={
                              necesitaValidacion && (
                                <Button
                                  disabled={
                                    !(
                                      torreYaIniciada() &&
                                      ["Encargado Obras"].includes(user_rol)
                                    )
                                  }
                                  style={{ marginLeft: 15 }}
                                  type="primary"
                                  size="small"
                                  onClick={() => {
                                    setProcesoAValidar({
                                      ...contenido,
                                      orden_proceso: procesoKey,
                                    });
                                    setModalVisible(true);
                                  }}
                                >
                                  <AiOutlineCheckCircle />
                                </Button>
                              )
                            }
                          >
                            {hayAptsDisponibles ? (
                              Object.entries(pisosFiltrados)
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
                                          {apt.estado === "1" ? (
                                            <Popconfirm
                                              disabled={
                                                !["Encargado Obras"].includes(
                                                  user_rol
                                                )
                                              }
                                              title="¿Estás seguro de que deseas confirmar este APT?"
                                              onConfirm={() =>
                                                confirmarApt(
                                                  apt.id,
                                                  contenido.orden_proceso
                                                )
                                              }
                                              okText="Sí"
                                              cancelText="No"
                                            >
                                              <Button
                                                style={{
                                                  minWidth: "40px",
                                                  height: "32px",
                                                  padding: "0 8px",
                                                  borderRadius: "6px",
                                                  border: "none",
                                                  background:
                                                    "linear-gradient(135deg, #1890ff, #36cfc9)",
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
                                                        border:
                                                          "2px solid #fff",
                                                      }}
                                                    />
                                                  )}
                                              </Button>
                                            </Popconfirm>
                                          ) : (
                                            <Button
                                              style={{
                                                minWidth: "40px",
                                                height: "32px",
                                                padding: "0 8px",
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
                                                cursor: "default",
                                                position: "relative",
                                              }}
                                              disabled
                                            >
                                              {apt.consecutivo}
                                              {necesitaValidacion && (
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
                                          )}
                                        </Tooltip>
                                      ))}
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <Empty
                                description="No hay apartamentos disponibles en este momento"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                              />
                            )}
                          </Card>
                        </Col>
                      );
                    })}
                </Row>
              ) : (
                <Card
                  style={{
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  <Text type="secondary">
                    Seleccione un proceso para ver los apartamentos disponibles
                  </Text>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal de Validación */}
      <Modal
        visible={modalVisible}
        title={"Validar proceso" + " " + procesoAValidar?.nombre_proceso}
        onOk={handleValidarProceso}
        onCancel={() => setModalVisible(false)}
        okText="Validar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: !pisoSeleccionado }}
      >
        <p>
          ¿Confirmas que esta validacion se cumple:{" "}
          <strong>{procesoAValidar?.text_validacion.toUpperCase()}</strong>?
        </p>

        <p>
          <span style={{ color: "blue" }}>
            Selecciona el piso que cumple con esta condición y valídalo para
            poder activarlo.
          </span>
        </p>

        <Select
          style={{ width: "100%" }}
          options={OpcionesValidacion}
          value={pisoSeleccionado}
          onChange={setPisoSeleccionado}
        />
      </Modal>
    </div>
  );
};
