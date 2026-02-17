import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Tag,
  Button,
  Typography,
  Spin,
  notification,
  Tooltip,
  Modal,
} from "antd";
import { ColumnsType } from "antd/es/table";
import {
  CheckOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getDocumentaCIonProyecto,
  getNombreProyectosXCodigo,
  deleteDocumentacionProyecto,
  getFechasProyecto,
} from "@/services/documentacion/documentacionAPI";
import { ModalConfirmacion } from "./ModalConfirmacion";
import { VerDocumentoRed } from "../../../../components/VerDocumentoRed";
import { StyledCard } from "@/components/layout/styled";
import { DataTable } from "@/components/global/DataTable";
import useSessionStorage from "@/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import { AiFillClockCircle } from "react-icons/ai";

const { Title } = Typography;
const { confirm } = Modal;

interface DocumentacionDetalle {
  id: number;
  codigo_proyecto: string;
  codigo_documento: string;
  etapa: number;
  actividad_id: number;
  actividad_depende_id: number | null;
  tipo: string;
  orden: number;
  fecha_proyeccion: string;
  fecha_actual: string;
  fecha_confirmacion: string | null;
  usaurio_id: number;
  estado: string;
  operador: number;
  observacion: string;
  nombre_etapa: string;
  created_at: string | null;
  updated_at: string | null;
  diferenciaDias?: string | null;
  actividad?: {
    id: number;
    actividad: string;
    tiempo: number;
    descripcion: string;
    tipo: number;
    etapa: number;
    operador: number;
    estado: string;
  };
}

export const ListaActividadesProyecto = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<DocumentacionDetalle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [actividadSeleccionada, setActividadSeleccionada] =
    useState<DocumentacionDetalle | null>(null);
  const [nombrePro, setNombrePro] = useState<string>("");
  const [nombreProyecto, setNombreProyecto] = useState<any>([]);
  const { getSessionVariable } = useSessionStorage();
  const [estadoActividad, setEstadoActividad] = useState<string>("");
  const user_rol = getSessionVariable(KEY_ROL);
  const [fechaProyecto, setFechaProyecto] = useState<any>([]);

  const proyecto = location.state?.codigo_documento;

  useEffect(() => {
    if (proyecto?.codigo_documento) {
      cargarActividades();
      buscarProyectoName();
      buscarFechasProyecto();
    }
  }, [proyecto?.codigo_documento]);

  const cargarActividades = () => {
    setLoading(true);
    buscarFechasProyecto();
    getDocumentaCIonProyecto(proyecto.codigo_documento)
      .then(({ data }) => {
        setData(data.data || []);
        setLoading(false);
        if (data.data && data.data.length > 0) {
          setNombrePro(data.data[0].nombre_etapa);
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "No se pudieron cargar las actividades",
        });
        setLoading(false);
      });
  };

  const buscarProyectoName = () => {
    setLoading(true);
    getNombreProyectosXCodigo(proyecto.codigo_proyecto)
      .then(({ data }) => {
        setNombreProyecto(data || []);
        setLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "No se pudieron cargar el proyecto",
        });
        setLoading(false);
      });
  };

  const buscarFechasProyecto = () => {
    setLoading(true);
    getFechasProyecto(proyecto.codigo_documento)
      .then(({ data }) => {
        setFechaProyecto(data || []);
        setLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "No se pudieron cargar las fechas del proyecto",
        });
        setLoading(false);
      });
  };

  const handleEliminarActividad = (actividad: DocumentacionDetalle) => {
    confirm({
      title: "¿Está seguro de eliminar esta actividad?",
      content:
        "Si esta actividad afecta la secuencia, se eliminarán las actividades dependientes en cascada.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        setLoading(true);
        deleteDocumentacionProyecto(actividad.id)
          .then(() => {
            notification.success({
              message: "Éxito",
              description: "Actividad eliminada correctamente",
            });
            cargarActividades();
          })
          .catch((error) => {
            notification.error({
              message: "Error",
              description: "No se pudo eliminar la actividad",
            });
            setLoading(false);
          });
      },
    });
  };

  const rolesPermitidos = ["Tramites", "Directora Proyectos", "Administrador"];
  const rolesPermitidosBasicos = ["Ingeniero Obra"];

  const abrirModalConfirmacion = (
    actividad: DocumentacionDetalle,
    estado: string,
  ) => {
    setActividadSeleccionada(actividad);
    setEstadoActividad(estado);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setActividadSeleccionada(null);
  };

  const getEstadoTexto = (estado: number) => {
    switch (estado) {
      case 0:
        return "Pendiente";
      case 1:
        return "Disponible";
      case 2:
        return "Completado";
      default:
        return "Desconocido";
    }
  };

  const getEstadoColor = (estado: number) => {
    switch (estado) {
      case 0:
        return "orange";
      case 1:
        return "blue";
      case 2:
        return "green";
      default:
        return "default";
    }
  };

  const getFechaRealColor = (
    fechaConfirmacion: string | null,
    fechaProyeccion: string,
  ) => {
    if (!fechaConfirmacion) return "black";

    const confirmacion = dayjs(fechaConfirmacion);
    const proyeccion = dayjs(fechaProyeccion);

    if (confirmacion.isAfter(proyeccion)) {
      return "red";
    } else {
      return "green";
    }
  };

  const renderFechaReal = (record: DocumentacionDetalle) => {
    const { fecha_confirmacion, fecha_proyeccion, diferenciaDias } = record;

    if (!fecha_confirmacion) {
      return (
        <Tooltip title="No hay fecha de confirmación registrada">
          <span style={{ color: "#999", fontStyle: "italic" }}>
            No disponible
          </span>
        </Tooltip>
      );
    }

    const color = getFechaRealColor(fecha_confirmacion, fecha_proyeccion);
    const fechaFormateada = dayjs(fecha_confirmacion).format("DD/MM/YYYY");
    const tooltipMessage = diferenciaDias || "Sin información de diferencia";

    return (
      <Tooltip title={tooltipMessage}>
        <span style={{ color, fontWeight: 500, cursor: "help" }}>
          {fechaFormateada}{" "}
          <InfoCircleOutlined style={{ marginLeft: 4, fontSize: 12 }} />
        </span>
      </Tooltip>
    );
  };

  const columns: ColumnsType<DocumentacionDetalle> = [
    {
      title: "Orden",
      dataIndex: "orden",
      key: "orden",
      width: 80,
      sorter: (a, b) => a.orden - b.orden,
    },
    {
      title: "Actividad",
      dataIndex: ["actividad", "actividad"],
      key: "actividad",
      render: (text: string, record: DocumentacionDetalle) => (
        <div>
          <strong>{text || "Sin nombre"}</strong>
          <br />
          <small style={{ color: "#666" }}>Tipo: {record.tipo}</small>
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado: number) => (
        <Tag color={getEstadoColor(estado)}>{getEstadoTexto(estado)}</Tag>
      ),
    },
    {
      title: "Fecha Proyección",
      dataIndex: "fecha_proyeccion",
      key: "fecha_proyeccion",
      render: (fecha: string) =>
        fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Fecha Real",
      key: "fecha_real",
      render: (_: any, record: DocumentacionDetalle) => renderFechaReal(record),
    },

    ...(rolesPermitidosBasicos.includes(user_rol)
      ? [
          {
            title: "Acciones",
            key: "acciones_ver",
            align: "center" as const,
            render: (_: any, record: DocumentacionDetalle) => {
              if (record.estado == "2") {
                return (
                  <VerDocumentoRed
                    documento_id={record.id}
                    nombreProyecto={record.nombre_etapa}
                  />
                );
              } else {
                return (
                  <Tooltip title="Espera de confirmacion">
                    <Button
                      size="small"
                      style={{
                        marginRight: "12px",
                        background: "#4523ee",
                        color: "white",
                      }}
                      disabled
                      icon={<AiFillClockCircle />}
                    />
                  </Tooltip>
                );
              }
            },
          },
        ]
      : []),

    ...(rolesPermitidos.includes(user_rol)
      ? [
          {
            title: "Acciones",
            key: "acciones_confirmar",
            render: (_: any, record: DocumentacionDetalle) => (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {record.estado == "2" && (
                  <VerDocumentoRed
                    documento_id={record.id}
                    nombreProyecto={record.nombre_etapa}
                  />
                )}

                <Button
                  type="primary"
                  size="small"
                  disabled={record.estado == "0"}
                  icon={<CheckOutlined />}
                  onClick={() => abrirModalConfirmacion(record, record.estado)}
                >
                  Confirmar
                </Button>

                {record.estado == "2" && (
                  <>
                    {user_rol.includes("Administrador") ||
                    user_rol.includes("Directora Proyectos") ? (
                      <Tooltip title="Eliminar actividad">
                        <Button
                          type="default"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleEliminarActividad(record)}
                        >
                          Eliminar
                        </Button>
                      </Tooltip>
                    ) : null}
                  </>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <p>Cargando actividades...</p>
      </div>
    );
  }

  return (
    <StyledCard
      title={
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              padding: "20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Sección de información del proyecto */}
            <div
              style={{
                display: "grid",
                gap: "8px",
                padding: "16px",
                backgroundColor: "white",
                borderRadius: "8px",
                borderLeft: "4px solid #1890ff",
              }}
            >
              <Title level={4} style={{ margin: 0, color: "#001529" }}>
                <b>PROYECTO: {nombreProyecto.descripcion_proyecto}</b>
              </Title>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#e6f7ff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#1890ff",
                    fontWeight: "500",
                  }}
                >
                  INFO
                </span>
                <Title level={5} style={{ margin: 0, color: "#595959" }}>
                  {nombrePro || "Proyecto no encontrado"}
                </Title>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "8px 16px",
                  marginTop: "12px",
                }}
              >
                <span style={{ color: "#8c8c8c", fontWeight: "500" }}>
                  Código:
                </span>
                <span
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    color: "#262626",
                  }}
                >
                  {proyecto?.codigo_documento}
                </span>

                <span style={{ color: "#8c8c8c", fontWeight: "500" }}>
                  Etapa:
                </span>
                <span
                  style={{
                    backgroundColor: "#f6ffed",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    color: "#52c41a",
                    border: "1px solid #b7eb8f",
                    fontWeight: "500",
                  }}
                >
                  {proyecto?.etapa}
                </span>
              </div>
            </div>

            {/* Sección de estado de entrega */}
            <div
              style={{
                display: "grid",
                gap: "12px",
                padding: "16px",
                backgroundColor: "white",
                borderRadius: "8px",
                borderLeft: "4px solid #52c41a",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#135200",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <b>ESTADO ENTREGA PROYECTO</b>
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#fff7e6",
                    borderRadius: "6px",
                    border: "1px solid #ffe7ba",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#d46b00",
                      marginBottom: "4px",
                    }}
                  >
                    Fecha Entrega Propietarios
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#873800",
                    }}
                  >
                    {fechaProyecto.fechaPropietario}
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f6ffed",
                    borderRadius: "6px",
                    border: "1px solid #b7eb8f",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#389e0d",
                      marginBottom: "4px",
                    }}
                  >
                    Fecha Entrega Real
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#135200",
                    }}
                  >
                    {fechaProyecto.fechaReal}
                  </div>
                </div>
              </div>

              {/* Cálculo de diferencia de días y validación */}
              {fechaProyecto.fechaReal && fechaProyecto.fechaPropietario && (
                <>
                  {/* Convertir fechas de string a objeto Date (formato dd/mm/yyyy) */}
                  {(() => {
                    // Función para convertir fecha en formato dd/mm/yyyy a Date
                    const parseFecha = (fechaStr) => {
                      if (!fechaStr) return null;
                      const [dia, mes, anio] = fechaStr.split("/");
                      return new Date(anio, mes - 1, dia);
                    };

                    const fechaReal = parseFecha(fechaProyecto.fechaReal);
                    const fechaPropietario = parseFecha(
                      fechaProyecto.fechaPropietario,
                    );

                    if (fechaReal && fechaPropietario) {
                      // Calcular diferencia en días
                      const diffTime = fechaReal - fechaPropietario;
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24),
                      );

                      // Validar que fecha real no sea mayor a fecha propietario
                      const esValida = fechaReal <= fechaPropietario;

                      return (
                        <>
                          {/* Indicador de estado */}
                          <div
                            style={{
                              marginTop: "8px",
                              padding: "12px",
                              borderRadius: "6px",
                              backgroundColor: esValida ? "#f6ffed" : "#fff1f0",
                              border: `1px solid ${
                                esValida ? "#b7eb8f" : "#ffa39e"
                              }`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: esValida
                                    ? "#52c41a"
                                    : "#f5222d",
                                }}
                              />
                              <span
                                style={{ fontSize: "13px", color: "#595959" }}
                              >
                                {esValida
                                  ? "✅ Entrega dentro del plazo"
                                  : "❌ Fecha real supera fecha propietarios"}
                              </span>
                            </div>

                            {/* Mostrar días de diferencia */}
                            <div
                              style={{
                                backgroundColor: esValida
                                  ? "#52c41a"
                                  : "#f5222d",
                                color: "white",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              {diffDays === 0
                                ? "Mismo día"
                                : `${Math.abs(diffDays)} ${
                                    Math.abs(diffDays) === 1 ? "día" : "días"
                                  } ${diffDays < 0 ? "antes" : "después"}`}
                            </div>
                          </div>

                          {/* Alerta si la fecha real es mayor */}
                          {!esValida && (
                            <div
                              style={{
                                marginTop: "8px",
                                padding: "8px 12px",
                                backgroundColor: "#fff2e8",
                                border: "1px solid #ffbb96",
                                borderRadius: "4px",
                                color: "#ad4e00",
                                fontSize: "13px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>⚠️</span>
                              <span>
                                <strong>Advertencia:</strong> La fecha real
                                supera por {diffDays} días la fecha de
                                propietarios
                              </span>
                            </div>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}
                </>
              )}
            </div>
          </div>
        </>
      }
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      }
    >
      {data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>No se encontraron actividades para este proyecto</p>
        </div>
      ) : (
        <DataTable
          size="small"
          dataSource={data}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 100,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} actividades`,
          }}
          scroll={{ x: 1200 }}
        />
      )}

      <ModalConfirmacion
        visible={modalVisible}
        actividad={actividadSeleccionada}
        estado={estadoActividad}
        onClose={cerrarModal}
        onConfirm={cargarActividades}
      />
    </StyledCard>
  );
};
