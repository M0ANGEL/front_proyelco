import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  Tag,
  Button,
  Typography,
  Spin,
  notification,
  Space,
  Modal,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { CheckOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import {
  ConfirmarTM,
  getDocumentaCIonOrganismos,
  getNombreProyectosXCodigo,
  TmDisponiblesOrganismos,
} from "@/services/documentacion/documentacionAPI";
import { ModalConfirmacionOrganismo } from "./ModalConfirmacionOrganismo";
import { StyledCard } from "@/components/layout/styled";
import { VerDocumentoOrganismos } from "../../../../components/VerDocumentosOrganismos";
import useSessionStorage from "@/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Title } = Typography;
const { confirm } = Modal;

interface DocumentacionDetalle {
  id: number;
  nombre_etapa: string;
  codigo_proyecto: string;
  codigo_documento: string;
  etapa: number;
  actividad_id: number;
  actividad_depende_id: number | null;
  tipo: string;
  orden: number;
  fecha_confirmacion: string | null;
  usuario_id: number | null;
  estado: number;
  operador: number;
  observacion: string | null;
  created_at: string | null;
  updated_at: string | null;
  actividad?: {
    id: number;
    actividad: string;
    tipo: number;
    padre: string;
    operador: number;
    estado: number;
    created_at: string | null;
    updated_at: string | null;
  };
  hijos?: DocumentacionDetalle[];
}

interface TmDisponible {
  id: number;
  codigo_proyecto: string;
  codigo_documento: string;
  user_id: number | null;
  actividad_id: number;
  actividad_hijos_id: number;
  tm: string;
  estado: number;
  created_at: string | null;
  updated_at: string | null;
}

export const ListaActividadesOrganismos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<DocumentacionDetalle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [actividadSeleccionada, setActividadSeleccionada] =
    useState<DocumentacionDetalle | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [nombrePro, setNombrePro] = useState<string>("");
  const [nombreProyecto, setNombreProyecto] = useState<any>([]);
  const [tmDictamen, setTmDictamen] = useState<TmDisponible[]>([]);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  const proyecto = location.state?.proyecto || location.state;

  // Definir roles permitidos
  const rolesPermitidos = ["Tramites", "Directora Proyectos", "Administrador"];

  // Verificar si el usuario tiene permisos
  const tienePermisos = rolesPermitidos.includes(user_rol);

  useEffect(() => {
    if (proyecto) {
      cargarActividades();
      buscarProyectoName();
      cargarTM();
    } else {
      console.error("No se encontró código de documento en location.state");
      setLoading(false);
      notification.warning({
        message: "Datos incompletos",
        description: "No se encontró información del proyecto",
      });
    }
  }, [proyecto]);

  const cargarActividades = () => {
    setLoading(true);

    getDocumentaCIonOrganismos(proyecto)
      .then(({ data }) => {
        setData(data.data || []);
        setNombrePro(data.data[0].nombre_etapa);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando actividades:", error);
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
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "No se pudieron cargar el proyecto",
        });
        setLoading(false);
      });
  };

  const cargarTM = () => {
    setLoading(true);

    TmDisponiblesOrganismos(proyecto)
      .then(({ data }) => {
        setTmDictamen(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando TM:", error);
        notification.error({
          message: "Error",
          description: "No se pudieron cargar los TM",
        });
        setLoading(false);
      });
  };

  const abrirModalConfirmacion = (actividad: DocumentacionDetalle) => {
    // Verificar permisos antes de abrir el modal
    if (!tienePermisos) {
      notification.warning({
        message: "Permiso denegado",
        description: "No tiene permisos para confirmar actividades",
      });
      return;
    }

    setActividadSeleccionada(actividad);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setActividadSeleccionada(null);
  };

  // Función para obtener el estado de un TM específico
  const getEstadoTM = (actividadId: number, tm: string): number => {
    const tmEncontrado = tmDictamen.find(
      (t) => t.actividad_hijos_id === actividadId && t.tm === tm,
    );
    return tmEncontrado?.estado ?? 0;
  };

  // Función para verificar si un registro debe mostrar TM
  const debeMostrarTM = (actividad: DocumentacionDetalle): boolean => {
    // Solo aplica a registros hijos (tipo "hijos")
    if (actividad.tipo !== "hijos") return false;

    const { operador, actividad_depende_id, actividad_id } = actividad;

    // operador 1: actividad_depende_id = 28 y actividad_id en [34, 35, 36]
    if (
      operador === 1 &&
      actividad_depende_id === 28 &&
      [34, 35, 36].includes(actividad_id)
    ) {
      const tieneTM = tmDictamen.some(
        (tm) => tm.actividad_hijos_id === actividad_id,
      );
      return tieneTM;
    }

    // operador 2: actividad_depende_id = 65 y actividad_id = 67
    if (operador === 2 && actividad_depende_id === 65 && actividad_id === 67) {
      const tieneTM = tmDictamen.some(
        (tm) => tm.actividad_hijos_id === actividad_id,
      );
      return tieneTM;
    }

    // operador 3: actividad_depende_id = 90 y actividad_id = 67
    if (operador === 3 && actividad_depende_id === 90 && actividad_id === 92) {
      const tieneTM = tmDictamen.some(
        (tm) => tm.actividad_hijos_id === actividad_id,
      );
      return tieneTM;
    }

    return false;
  };

  // Función para obtener los TM de una actividad
  const obtenerTMsDeActividad = (actividadId: number): string[] => {
    const tms = tmDictamen
      .filter((tm) => tm.actividad_hijos_id === actividadId)
      .map((tm) => tm.tm);
    return [...new Set(tms)]; // Eliminar duplicados
  };

  // Función para manejar clic en botón TM
  const handleClickTM = (actividad: DocumentacionDetalle, tm: string) => {
    // Verificar permisos para TM (solo roles permitidos)
    if (!tienePermisos) {
      return; // No hacer nada si no tiene permisos
    }

    const estadoTM = getEstadoTM(actividad.actividad_id, tm);

    // Si el estado es 2, no hacer nada (botón deshabilitado)
    if (estadoTM === 2) {
      notification.info({
        message: "TM ya confirmado",
        description: "Este TM ya ha sido confirmado previamente",
      });
      return;
    }

    confirm({
      title: "Confirmar TM",
      content: `¿Está seguro que desea confirmar el TM ${tm}?`,
      onOk() {
        enviarTM(actividad, tm);
      },
      onCancel() {
        console.log("Cancelado");
      },
    });
  };

  // Función para enviar TM a la API
  const enviarTM = async (actividad: DocumentacionDetalle, tm: string) => {
    setLoading(true);
    const data = {
      actividad_id: actividad.actividad_id,
      actividad_depende_id: actividad.actividad_depende_id,
      codigo_proyecto: actividad.codigo_proyecto,
      codigo_documento: actividad.codigo_documento,
      tm: tm,
    };

    try {
      await ConfirmarTM(data);
      cargarTM();
      notification.success({
        message: "Éxito",
        description: "TM confirmado correctamente",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error updating status:", error);
      notification.error({
        message: "Error",
        description: "No se pudo confirmar el TM",
      });
      setLoading(false);
    }
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

  const toggleExpand = (record: DocumentacionDetalle) => {
    const key = record.id;
    if (expandedRowKeys.includes(key)) {
      setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
    } else {
      setExpandedRowKeys([...expandedRowKeys, key]);
    }
  };

  // Columnas para rolesPermitidos (con todas las funcionalidades)
  const columnsRolesPermitidos: ColumnsType<DocumentacionDetalle> = [
    {
      title: "Actividad",
      dataIndex: ["actividad", "actividad"],
      key: "actividad",
      render: (text: string, record: DocumentacionDetalle) => (
        <div>
          <strong>{text || "Sin nombre"}</strong>
          {record.hijos && record.hijos.length > 0 && (
            <div>
              <small style={{ color: "#666" }}>
                {record.hijos.length} sub-actividad(es)
              </small>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: 120,
      render: (estado: number) => (
        <Tag color={getEstadoColor(estado)}>{getEstadoTexto(estado)}</Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 200,
      render: (_, record: DocumentacionDetalle) => {
        // Para registros que deben mostrar TM
        if (debeMostrarTM(record)) {
          const tms = obtenerTMsDeActividad(record.actividad_id);
          return (
            <Space size="small">
              {tms.map((tm, index) => {
                const estadoTM = getEstadoTM(record.actividad_id, tm);
                return (
                  <Button
                    key={index}
                    // type="default"
                    size="small"
                    onClick={() => handleClickTM(record, tm)}
                    disabled={estadoTM === 2}
                    style={{
                      backgroundColor: getEstadoColor(estadoTM),
                    }}
                  >
                    T {tm}
                  </Button>
                );
              })}
            </Space>
          );
        }

        return (
          <Space size="small">
            {/* Botón para expandir/contraer si tiene hijos */}
            {record.hijos && record.hijos.length > 0 && (
              <Button
                type="text"
                size="small"
                icon={
                  expandedRowKeys.includes(record.id) ? (
                    <DownOutlined />
                  ) : (
                    <RightOutlined />
                  )
                }
                onClick={() => toggleExpand(record)}
                title={
                  expandedRowKeys.includes(record.id) ? "Contraer" : "Expandir"
                }
              />
            )}

            {/* Botón Ver Documento cuando está completado - visible para TODOS */}
            {record.estado == 2 && !record.hijos && (
              <VerDocumentoOrganismos
                documento_id={record.id}
                nombreProyecto={record.nombre_etapa}
              />
            )}

            {/* Botón Confirmar cuando está disponible - SOLO para roles permitidos */}
            {!record.hijos && !debeMostrarTM(record) && (
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => abrirModalConfirmacion(record)}
                disabled={record.estado !== 1}
              >
                Confirmar
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  // Columnas para roles NO permitidos (pueden ver TM pero no interactuar)
  const columnsRolesNoPermitidos: ColumnsType<DocumentacionDetalle> = [
    {
      title: "Actividad",
      dataIndex: ["actividad", "actividad"],
      key: "actividad",
      render: (text: string, record: DocumentacionDetalle) => (
        <div>
          <strong>{text || "Sin nombre"}</strong>
          {record.hijos && record.hijos.length > 0 && (
            <div>
              <small style={{ color: "#666" }}>
                {record.hijos.length} sub-actividad(es)
              </small>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: 120,
      render: (estado: number) => (
        <Tag color={getEstadoColor(estado)}>{getEstadoTexto(estado)}</Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 200,
      render: (_, record: DocumentacionDetalle) => {
        // Para registros que deben mostrar TM - VISUAL SOLO
        if (debeMostrarTM(record)) {
          const tms = obtenerTMsDeActividad(record.actividad_id);
          return (
            <Space size="small">
              {tms.map((tm, index) => {
                const estadoTM = getEstadoTM(record.actividad_id, tm);
                return (
                  <Tag
                    key={index}
                    color={getEstadoColor(estadoTM)}
                    style={{
                      cursor: "default",
                      userSelect: "none",
                      opacity: 0.8,
                    }}
                  >
                    T {tm}
                  </Tag>
                );
              })}
            </Space>
          );
        }

        return (
          <Space size="small">
            {/* Botón para expandir/contraer si tiene hijos */}
            {record.hijos && record.hijos.length > 0 && (
              <Button
                type="text"
                size="small"
                icon={
                  expandedRowKeys.includes(record.id) ? (
                    <DownOutlined />
                  ) : (
                    <RightOutlined />
                  )
                }
                onClick={() => toggleExpand(record)}
                title={
                  expandedRowKeys.includes(record.id) ? "Contraer" : "Expandir"
                }
              />
            )}

            {/* Botón Ver Documento cuando está completado - visible para TODOS */}
            {record.estado == 2 && !record.hijos && (
              <VerDocumentoOrganismos
                documento_id={record.id}
                nombreProyecto={record.nombre_etapa}
              />
            )}

            {/* Espaciador para mantener consistencia visual */}
            {!record.hijos && record.estado !== 2 && (
              <div style={{ display: "inline-block", width: "32px" }} />
            )}
          </Space>
        );
      },
    },
  ];

  // Configuración expandible para rolesPermitidos
  const expandableRolesPermitidos = {
    expandedRowKeys,
    onExpandedRowsChange: setExpandedRowKeys,
    expandedRowRender: (record: DocumentacionDetalle) => (
      <div style={{ margin: 0, padding: 0 }}>
        {record.hijos &&
          record.hijos.map((hijo) => {
            const mostrarTM = debeMostrarTM(hijo);
            const tms = mostrarTM
              ? obtenerTMsDeActividad(hijo.actividad_id)
              : [];

            return (
              <div
                key={hijo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  backgroundColor: "#fafafa",
                  marginLeft: "20px",
                }}
              >
                {/* Actividad */}
                <div style={{ flex: 1 }}>
                  <strong>{hijo.actividad?.actividad || "Sin nombre"}</strong>
                {/* </div> */}

                {/* TM si aplica - SOLO para roles permitidos */}
                {mostrarTM ? (
                  // <div style={{ width: 50 }}>
                    <Space size="small">
                      {tms.map((tm, index) => {
                        const estadoTM = getEstadoTM(hijo.actividad_id, tm);
                        return (
                          <Button
                            type="default"
                            size="small"
                            onClick={() => handleClickTM(hijo, tm)}
                            disabled={estadoTM === 2}
                            style={{
                              backgroundColor:
                                estadoTM == 1
                                  ? "rgb(46, 128, 179)"
                                  : estadoTM == 2
                                    ? "rgb(48, 221, 65)"
                                    : "#4545",
                              color: "white",
                            }}
                          >
                            T-{tm}
                          </Button>
                        );
                      })}
                    </Space>
                  
                ) : (
                  ""
                )}

</div>
                {/* Estado */}
                {!mostrarTM && (
                  <div style={{ width: 120 }}>
                    <Tag color={getEstadoColor(hijo.estado)}>
                      {getEstadoTexto(hijo.estado)}
                    </Tag>
                  </div>
                )}

                {/* Acciones */}
                <div style={{ width: 150 }}>
                  <Space size="small">
                    {/* Botón Ver Documento cuando está completado - visible para TODOS */}
                    {hijo.estado == 2 && (
                      <VerDocumentoOrganismos
                        documento_id={hijo.id}
                        nombreProyecto={hijo.nombre_etapa}
                      />
                    )}

                    {/* Botón Confirmar cuando está disponible y no tiene TM - SOLO para roles permitidos */}
                    {!mostrarTM && (
                      <Button
                        type="primary"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => abrirModalConfirmacion(hijo)}
                        disabled={hijo.estado !== 1 || !tienePermisos}
                      >
                        Confirmar
                      </Button>
                    )}
                  </Space>
                </div>
              </div>
            );
          })}
      </div>
    ),
    rowExpandable: (record: DocumentacionDetalle) =>
      record.hijos !== undefined && record.hijos.length > 0,
  };

  // Configuración expandible para roles NO permitidos
  const expandableRolesNoPermitidos = {
    expandedRowKeys,
    onExpandedRowsChange: setExpandedRowKeys,
    expandedRowRender: (record: DocumentacionDetalle) => (
      <div style={{ margin: 0, padding: 0 }}>
        {record.hijos &&
          record.hijos.map((hijo) => {
            const mostrarTM = debeMostrarTM(hijo);
            const tms = mostrarTM
              ? obtenerTMsDeActividad(hijo.actividad_id)
              : [];

            return (
              <div
                key={hijo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  backgroundColor: "#fafafa",
                  marginLeft: "20px",
                }}
              >
                {/* Actividad */}
                <div style={{ flex: 1 }}>
                  <strong>{hijo.actividad?.actividad || "Sin nombre"}</strong>
                </div>

                {/* TM si aplica - VISUAL SOLO para roles no permitidos */}
                {mostrarTM ? (
                  <div style={{ width: 200 }}>
                    <Space size="small">
                      {tms.map((tm, index) => {
                        const estadoTM = getEstadoTM(hijo.actividad_id, tm);
                        return (
                          <Tag
                            key={index}
                            color={getEstadoColor(estadoTM)}
                            style={{
                              cursor: "default",
                              userSelect: "none",
                              opacity: 0.8,
                            }}
                          >
                            T- {tm}
                          </Tag>
                        );
                      })}
                    </Space>
                  </div>
                ) : (
                  ""
                )}

                {/* Estado */}
                <div style={{ width: 120 }}>
                  <Tag color={getEstadoColor(hijo.estado)}>
                    {getEstadoTexto(hijo.estado)}
                  </Tag>
                </div>

                {/* Acciones */}
                <div style={{ width: 150 }}>
                  <Space size="small">
                    {/* Botón Ver Documento cuando está completado - visible para TODOS */}
                    {hijo.estado == 2 && (
                      <VerDocumentoOrganismos
                        documento_id={hijo.id}
                        nombreProyecto={hijo.nombre_etapa}
                      />
                    )}
                  </Space>
                </div>
              </div>
            );
          })}
      </div>
    ),
    rowExpandable: (record: DocumentacionDetalle) =>
      record.hijos !== undefined && record.hijos.length > 0,
  };

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
        <div>
          <Title level={4}>
            PROYECTO: {nombreProyecto.descripcion_proyecto}
          </Title>

          <Title level={5}>INFO: {nombrePro || "Proyecto no encontrado"}</Title>
          <p>Código: {proyecto?.codigo_documento}</p>
          <p>Etapa: {proyecto?.etapa}</p>
        </div>
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
        <Table
          size="small"
          dataSource={data}
          columns={
            tienePermisos ? columnsRolesPermitidos : columnsRolesNoPermitidos
          }
          loading={loading}
          rowKey="id"
          expandable={
            tienePermisos
              ? expandableRolesPermitidos
              : expandableRolesNoPermitidos
          }
          pagination={{
            pageSize: 100,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} actividades`,
          }}
          scroll={{ x: 800 }}
        />
      )}

      <ModalConfirmacionOrganismo
        visible={modalVisible}
        actividad={actividadSeleccionada}
        onClose={cerrarModal}
        onConfirm={cargarActividades}
      />
    </StyledCard>
  );
};
