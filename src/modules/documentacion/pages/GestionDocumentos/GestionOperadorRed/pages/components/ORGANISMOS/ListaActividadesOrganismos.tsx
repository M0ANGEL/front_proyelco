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
} from "antd";
import { ColumnsType } from "antd/es/table";
import { CheckOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import {
  getDocumentaCIonOrganismos,
  getNombreProyectosXCodigo,
} from "@/services/documentacion/documentacionAPI";
import { ModalConfirmacionOrganismo } from "./ModalConfirmacionOrganismo";
import { VerDocumentoRed } from "../../../../components/VerDocumentoRed";
import { StyledCard } from "@/components/layout/styled";
import { VerDocumentoOrganismos } from "../../../../components/VerDocumentosOrganismos";

const { Title } = Typography;

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
  estado: number; // Cambiado de string a number
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

  const proyecto = location.state?.proyecto || location.state;

  useEffect(() => {
    if (proyecto) {
      cargarActividades();
      buscarProyectoName();
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

  const abrirModalConfirmacion = (actividad: DocumentacionDetalle) => {
    setActividadSeleccionada(actividad);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setActividadSeleccionada(null);
  };

  // CORREGIDO: Ahora maneja números en lugar de strings
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

  // CORREGIDO: Ahora maneja números en lugar de strings
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

  // Columnas principales
  const columns: ColumnsType<DocumentacionDetalle> = [
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
      render: (
        estado: number // CORREGIDO: ahora recibe number
      ) => <Tag color={getEstadoColor(estado)}>{getEstadoTexto(estado)}</Tag>,
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 150,
      render: (_, record: DocumentacionDetalle) => (
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

          {/* Botón Ver Documento cuando está completado - SOLO para items sin hijos */}
          {record.estado === 2 &&
            !record.hijos && ( // CORREGIDO: ahora usa número 2
               <VerDocumentoOrganismos
                documento_id={record.id} // <-- aquí
                nombreProyecto={record.nombre_etapa}
              />
            )}

          {/* Botón Confirmar cuando está disponible - SOLO para items sin hijos */}
          {!record.hijos && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => abrirModalConfirmacion(record)}
              disabled={record.estado !== 1} // CORREGIDO: ahora usa número 1
            >
              Confirmar
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Configuración expandible
  const expandable = {
    expandedRowKeys,
    onExpandedRowsChange: setExpandedRowKeys,
    expandedRowRender: (record: DocumentacionDetalle) => (
      <div style={{ margin: 0, padding: 0 }}>
        {record.hijos &&
          record.hijos.map((hijo) => (
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

              {/* Estado */}
              <div style={{ width: 120 }}>
                <Tag color={getEstadoColor(hijo.estado)}>
                  {getEstadoTexto(hijo.estado)}
                </Tag>
              </div>

              {/* Acciones para hijos */}
              <div style={{ width: 150 }}>
                <Space size="small">
                  {/* Botón Ver Documento cuando está completado */}
                  {hijo.estado === 2 && ( // CORREGIDO: ahora usa número 2
                    <VerDocumentoRed
                      codigo_proyecto={hijo.codigo_proyecto}
                      codigo_documento={hijo.codigo_documento}
                      etapa={hijo.etapa}
                      actividad_id={hijo.actividad_id}
                      nombreProyecto={hijo.nombre_etapa}
                    />
                  )}

                  {/* Botón Confirmar cuando está disponible */}
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={() => abrirModalConfirmacion(hijo)}
                    disabled={hijo.estado !== 1} // CORREGIDO: ahora usa número 1
                  >
                    Confirmar
                  </Button>
                </Space>
              </div>
            </div>
          ))}
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
          columns={columns}
          loading={loading}
          rowKey="id"
          expandable={expandable}
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
