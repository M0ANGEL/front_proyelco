import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tag, Button, Typography, Spin, notification, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getDocumentaCIonProyecto,
  getNombreProyectosXCodigo,
} from "@/services/documentacion/documentacionAPI";
import { ModalConfirmacion } from "./ModalConfirmacion";
import { VerDocumentoRed } from "../../../../components/VerDocumentoRed";
import { StyledCard } from "@/components/layout/styled";
import { DataTable } from "@/components/global/DataTable";
import useSessionStorage from "@/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import { AiFillClockCircle } from "react-icons/ai";

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
  const user_rol = getSessionVariable(KEY_ROL);

  const proyecto = location.state?.codigo_documento;

  useEffect(() => {
    if (proyecto?.codigo_documento) {
      cargarActividades();
      buscarProyectoName();
    }
  }, [proyecto?.codigo_documento]);

  const cargarActividades = () => {
    setLoading(true);
    getDocumentaCIonProyecto(proyecto.codigo_documento)
      .then(({ data }) => {
        setData(data.data || []);
        setLoading(false);
        setNombrePro(data.data[0].nombre_etapa);
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
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "No se pudieron cargar el proyecto",
        });
        setLoading(false);
      });
  };

  const rolesPermitidos = ["Tramites", "Directora Proyectos", "Administrador"];
  const rolesPermitidosBasicos = ["Ingeniero Obra"];

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

  // const columns: ColumnsType<DocumentacionDetalle> = [
  //   {
  //     title: "Orden",
  //     dataIndex: "orden",
  //     key: "orden",
  //     width: 80,
  //     sorter: (a, b) => a.orden - b.orden,
  //   },
  //   {
  //     title: "Actividad",
  //     dataIndex: ["actividad", "actividad"],
  //     key: "actividad",
  //     render: (text: string, record: DocumentacionDetalle) => (
  //       <div>
  //         <strong>{text || "Sin nombre"}</strong>
  //         <br />
  //         <small style={{ color: "#666" }}>Tipo: {record.tipo}</small>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Estado",
  //     dataIndex: "estado",
  //     key: "estado",
  //     render: (estado: number) => (
  //       <Tag color={getEstadoColor(estado)}>{getEstadoTexto(estado)}</Tag>
  //     ),
  //   },
  //   {
  //     title: "Fecha Proyección",
  //     dataIndex: "fecha_proyeccion",
  //     key: "fecha_proyeccion",
  //     render: (fecha: string) =>
  //       fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-",
  //   },
  //   ...(rolesPermitidos.includes(user_rol)
  //   ? [
  //      {
  //     title: "Acciones",
  //     key: "acciones",
  //     align: "center",
  //     render: (_, record: DocumentacionDetalle) => (
  //         {record.estado == "2" ? (
  //             <VerDocumentoRed
  //               documento_id={record.id} // <-- aquí
  //               nombreProyecto={record.nombre_etapa}
  //             />
  //         ) : (
  //           ""
  //         )}
  //     ),
  //   },
  //   ] : []),

  //   ...(rolesPermitidos.includes(user_rol)
  //     ? [
  //         {
  //           title: "Fecha Real",
  //           dataIndex: "fecha_actual",
  //           key: "fecha_actual",
  //           render: (fecha: string) =>
  //             fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-",
  //         },
  //         {
  //           title: "Acciones",
  //           key: "acciones",
  //           render: (_: any, record: DocumentacionDetalle) => (
  //             <>
  //               {record.estado == "2" && (
  //                 <VerDocumentoRed
  //                   documento_id={record.id}
  //                   nombreProyecto={record.nombre_etapa}
  //                 />
  //               )}
  //               <Button
  //                 type="primary"
  //                 size="small"
  //                 icon={<CheckOutlined />}
  //                 onClick={() => abrirModalConfirmacion(record)}
  //                 disabled={record.estado != "1"}
  //               >
  //                 Confirmar
  //               </Button>
  //             </>
  //           ),
  //         },
  //       ]
  //     : []),
  // ];

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

    //  Columna solo para ciertos roles (ver documento)
    ...(rolesPermitidosBasicos.includes(user_rol)
      ? [
          {
            title: "Acciones",
            key: "acciones_ver",
            align: "center" as const,
            render: (_: any, record: DocumentacionDetalle) =>
              record.estado == "2" ? (
                <VerDocumentoRed
                  documento_id={record.id}
                  nombreProyecto={record.nombre_etapa}
                />
              ) : (
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
              ),
          },
        ]
      : []),

    //  Columnas adicionales para ciertos roles
    ...(rolesPermitidos.includes(user_rol)
      ? [
          {
            title: "Fecha Real",
            dataIndex: "fecha_actual",
            key: "fecha_actual",
            render: (fecha: string) =>
              fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-",
          },
          {
            title: "Acciones",
            key: "acciones_confirmar",
            render: (_: any, record: DocumentacionDetalle) => (
              <>
                {record.estado == "2" && (
                  <VerDocumentoRed
                    documento_id={record.id}
                    nombreProyecto={record.nombre_etapa}
                  />
                )}
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => abrirModalConfirmacion(record)}
                  disabled={record.estado != "1"}
                  style={{ marginLeft: 8 }}
                >
                  Confirmar
                </Button>
              </>
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
