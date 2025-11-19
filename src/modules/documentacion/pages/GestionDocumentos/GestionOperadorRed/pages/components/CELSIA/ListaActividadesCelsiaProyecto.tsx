import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Tag, Button, Typography, Spin, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getDocumentaCIonProyecto } from "@/services/documentacion/documentacionAPI";
import { ModalConfirmacion } from "./ModalConfirmacion";
import { VerDocumentoRed } from "../../../../components/VerDocumentoRed";
import { StyledCard } from "@/components/layout/styled";

const { Title } = Typography;

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
  actividad?: {
    id: number;
    actividad: string;
    tiempo: number;
    descripcion: string;
    tipo: number;
    etapa: number;
    operador: number;
    estado: number;
  };
}

export const ListaActividadesCelsiaProyecto = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<DocumentacionDetalle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [actividadSeleccionada, setActividadSeleccionada] =
    useState<DocumentacionDetalle | null>(null);

  const proyecto = location.state?.codigo_documento;
  useEffect(() => {
    if (proyecto?.codigo_documento) {
      cargarActividades();
    }
  }, [proyecto?.codigo_documento]);

  const cargarActividades = () => {
    setLoading(true);
    getDocumentaCIonProyecto(proyecto.codigo_documento)
      .then(({ data }) => {
        setData(data.data || []);
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

  const abrirModalConfirmacion = (actividad: DocumentacionDetalle) => {
    setActividadSeleccionada(actividad);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setActividadSeleccionada(null);
  };

  // Función para obtener el texto del estado
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

  // Función para obtener el color del tag
  const getEstadoColor = (estado: number) => {
    switch (estado) {
      case 0:
        return "orange"; // Pendiente - naranja
      case 1:
        return "blue"; // Disponible - azul
      case 2:
        return "green"; // Completado - verde
      default:
        return "default";
    }
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
      dataIndex: "fecha_actual",
      key: "fecha_actual",
      render: (fecha: string) =>
        fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record: DocumentacionDetalle) => (
        <>
          {record.estado == "2" ? (
            <>
              <VerDocumentoRed
                codigo_proyecto={record?.codigo_proyecto}
                codigo_documento={record?.codigo_documento}
                etapa={record?.etapa}
                actividad_id={record?.actividad_id}
                nombreProyecto={record.nombre_etapa}
              />
            </>
          ) : (
            ""
          )}
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => abrirModalConfirmacion(record)}
            disabled={record.estado == "1" ? false : true}
          >
            Confirmar
          </Button>
        </>
      ),
    },
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
        <div>
          <Title level={3}>
            Actividades del Proyecto:{" "}
            {proyecto?.nombre_etapa || "Proyecto no encontrado"}
          </Title>
          <p>Código: {proyecto?.codigo_proyecto}</p>
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
          pagination={{
            pageSize: 100,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} actividades`,
          }}
          scroll={{ x: 1000 }}
        />
      )}

      <ModalConfirmacion
        visible={modalVisible}
        actividad={actividadSeleccionada}
        onClose={cerrarModal}
        onConfirm={cargarActividades}
      />
    </StyledCard>
  );
};
