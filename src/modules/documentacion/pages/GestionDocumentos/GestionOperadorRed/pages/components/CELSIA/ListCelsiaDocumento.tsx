import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Tag,
  Row,
  Col,
  Badge,
  Modal,
  Spin,
  notification,
  Tooltip,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  getDocumentosDisponibles,
  getProyectosDocumentacionCelsia,
} from "@/services/documentacion/documentacionAPI";
import { useNavigate } from "react-router-dom";
import { CaretRightOutlined, FileTextOutlined } from "@ant-design/icons";
import { StyledCard } from "@/components/layout/styled";
import { SearchBar } from "@/components/global/SearchBar";
import { DataTable } from "@/components/global/DataTable";
import { AiOutlineBell } from "react-icons/ai";

// Interfaces
interface DocumentacionType {
  codigo_proyecto: string;
  codigo_documento: string;
  etapa: number;
  operador: number;
  nombre_etapa: string;
  finish: boolean;
}

interface DataType {
  key: number;
  id: number;
  created_at: string;
  descripcion_proyecto: string;
  codigo_proyecto: string;
  tipoProyecto_id: string;
  documentacion: DocumentacionType[];
}

const { Text } = Typography;

// Función para obtener el texto de la etapa
const getTextoEtapa = (etapa: number) => {
  const etapas: { [key: number]: string } = {
    1: "ET1",
    2: "ET2",
    3: "ET3",
    4: "ET4",
    5: "ET5",
  };
  return etapas[etapa] || `ET${etapa}`;
};

// Función para obtener el color del tag de etapa
const getColorEtapa = (etapa: number) => {
  const colores: { [key: number]: string } = {
    1: "blue",
    2: "green",
    3: "orange",
    4: "purple",
    5: "cyan",
  };
  return colores[etapa] || "default";
};

export const ListCelsiaDocumento = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [etapaFilter, setEtapaFilter] = useState<string>();
  const [tipoProyectoFilter, setTipoProyectoFilter] = useState<string>();
  const [rangoDocumentosFilter, setRangoDocumentosFilter] = useState<string>();

  //estados del modal de documentos disponibles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datoModal, setDatoModal] = useState<any[]>([]);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  // Ejecución
  useEffect(() => {
    fetchTicketsAbiertosGestion();
  }, []);

  const fetchTicketsAbiertosGestion = () => {
    setLoading(true);
    getProyectosDocumentacionCelsia().then(({ data: { data } }) => {
      const proyectos = data.map((proyecto) => {
        return {
          key: proyecto?.id,
          id: proyecto?.id,
          descripcion_proyecto: proyecto?.descripcion_proyecto,
          codigo_proyecto: proyecto?.codigo_proyecto,
          tipoProyecto_id: proyecto?.tipoProyecto_id,
          documentacion: proyecto?.documentacion || [],
          created_at: dayjs(proyecto.created_at).format("DD-MM-YYYY HH:mm"),
        };
      });

      setInitialData(proyectos);
      setDataSource(proyectos);
      setLoading(false);
    });
  };

  //modal de documentos disponibles
  const showModal = (dato: string) => {
    setLoadingModal(true);
    setIsModalOpen(true);

    //hacer consula de datos
    getDocumentosDisponibles(dato)
      .then(({ data }) => {
        setDatoModal(data.data);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "No se pudieron cargar las actividades" + error,
        });
        setLoading(false);
      })
      .finally(() => {
        setLoadingModal(false);
      });
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  // Búsqueda global mejorada
  const handleSearch = (value: string) => {
    if (!value.trim()) {
      applyFilters(); // Aplica los filtros actuales sin búsqueda
      return;
    }

    const filterTable = initialData?.filter((o: DataType) =>
      Object.keys(o).some((k) =>
        String(o[k as keyof DataType])
          .toLowerCase()
          .includes(value.toLowerCase()),
      ),
    );
    setDataSource(filterTable);
  };

  // Aplicar filtros combinados
  const applyFilters = (searchValue?: string) => {
    let filteredData = [...initialData];

    // Aplicar búsqueda global si existe
    if (searchValue && searchValue.trim()) {
      filteredData = filteredData.filter((o: DataType) =>
        Object.keys(o).some((k) =>
          String(o[k as keyof DataType])
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        ),
      );
    }

    // Filtro por etapa
    if (etapaFilter) {
      filteredData = filteredData.filter((item) =>
        item.documentacion?.some((doc) => doc.etapa.toString() === etapaFilter),
      );
    }

    // Filtro por tipo de proyecto
    if (tipoProyectoFilter) {
      filteredData = filteredData.filter((item) =>
        item.tipoProyecto_id
          ?.toLowerCase()
          .includes(tipoProyectoFilter.toLowerCase()),
      );
    }

    // Filtro por rango de documentos
    if (rangoDocumentosFilter) {
      const cantidadDocumentos = (item) => item.documentacion?.length || 0;

      switch (rangoDocumentosFilter) {
        case "sin_documentos":
          filteredData = filteredData.filter(
            (item) => cantidadDocumentos(item) === 0,
          );
          break;
        case "pocos":
          filteredData = filteredData.filter(
            (item) =>
              cantidadDocumentos(item) > 0 && cantidadDocumentos(item) <= 3,
          );
          break;
        case "moderados":
          filteredData = filteredData.filter(
            (item) =>
              cantidadDocumentos(item) > 3 && cantidadDocumentos(item) <= 10,
          );
          break;
        case "muchos":
          filteredData = filteredData.filter(
            (item) => cantidadDocumentos(item) > 10,
          );
          break;
        default:
          break;
      }
    }

    setDataSource(filteredData);
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setEtapaFilter(undefined);
    setTipoProyectoFilter(undefined);
    setRangoDocumentosFilter(undefined);
    setDataSource(initialData);
  };

  // Aplicar filtros cuando cambien los valores
  useEffect(() => {
    applyFilters();
  }, [etapaFilter, tipoProyectoFilter, rangoDocumentosFilter, initialData]);

  // Navegar a la lista de actividades
  const verActividades = (proyecto: DataType, documento: DocumentacionType) => {
    navigate("actividades-celsia", {
      state: {
        codigo_documento: documento,
      },
    });
  };

  // Renderizar el contenido expandible (documentos directamente)
  const renderDocumentosExpandible = (record: DataType) => {
    if (!record.documentacion || record.documentacion.length === 0) {
      return (
        <div style={{ padding: "16px", textAlign: "center" }}>
          <Text type="secondary">No hay documentos para este proyecto</Text>
        </div>
      );
    }

    return (
      <div style={{ padding: "16px", background: "#fafafa" }}>
        <div style={{ marginBottom: "16px" }}>
          <Text strong style={{ fontSize: "14px" }}>
            Documentos del Proyecto ({record.documentacion.length})
          </Text>
        </div>

        <Row gutter={[16, 12]}>
          {record.documentacion.map((documento, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <div
                style={{
                  border: "1px solid #e8e8e8",
                  borderRadius: "10px",
                  padding: "16px",
                  background:
                    documento.finish === false
                      ? "linear-gradient(135deg, #1e88e5 0%, #64b5f6 100%)" // Azul degradado para pendiente
                      : "linear-gradient(135deg, #4caf50 0%, #81c784 100%)", // Verde degradado para completado
                  height: "100%",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <FileTextOutlined
                    style={{
                      color: "#ffffff",
                      marginRight: "10px",
                      fontSize: "18px",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "50%",
                      padding: "6px",
                    }}
                  />
                  <div>
                    <Text
                      strong
                      style={{
                        fontSize: "14px",
                        color: "#ffffff",
                        lineHeight: "1.2",
                      }}
                    >
                      {documento.nombre_etapa}
                    </Text>
                    <Text
                      style={{
                        fontSize: "11px",
                        color: "rgba(255, 255, 255, 0.9)",
                        display: "block",
                        marginTop: "2px",
                      }}
                    >
                      Código: {documento.codigo_documento}
                    </Text>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Tag
                    color={getColorEtapa(documento.etapa)}
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      border: "none",
                      color: documento.finish === false ? "#1e88e5" : "#4caf50",
                      background: "#ffffff",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {getTextoEtapa(documento.etapa)}
                  </Tag>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {/* modal de alerta para ver */}
                    <Tooltip title="Ver Documentos Disponibles">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => showModal(documento.codigo_documento)}
                        style={{
                          background: "#ffffff",
                          borderColor: "#ffffff",
                          color:
                            documento.finish === false ? "#1e88e5" : "#4caf50",
                          minWidth: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AiOutlineBell />
                      </Button>
                    </Tooltip>

                    <Button
                      type="primary"
                      size="small"
                      onClick={() => verActividades(record, documento)}
                      style={{
                        background: "#ffffff",
                        borderColor: "#ffffff",
                        color:
                          documento.finish === false ? "#1e88e5" : "#4caf50",
                        fontWeight: "bold",
                        fontSize: "12px",
                        height: "32px",
                      }}
                    >
                      Ver Actividades
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // Obtener opciones únicas para filtros
  const getUniqueOptions = (data: DataType[], key: keyof DataType) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]))].filter(
      Boolean,
    );
    return uniqueValues.map((value) => ({
      label: String(value).toUpperCase(),
      value: String(value),
    }));
  };

  // Obtener todas las etapas únicas de todos los documentos
  const getEtapasUnicas = (data: DataType[]) => {
    const todasEtapas = data.flatMap(
      (item) => item.documentacion?.map((doc) => doc.etapa) || [],
    );
    const etapasUnicas = [...new Set(todasEtapas)].sort();

    return etapasUnicas.map((etapa) => ({
      label: getTextoEtapa(etapa),
      value: etapa.toString(),
    }));
  };

  // Columnas de la tabla
  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creación",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    {
      title: "Código Proyecto",
      dataIndex: "codigo_proyecto",
      key: "codigo_proyecto",
      width: 120,
      sorter: (a, b) => a.codigo_proyecto.localeCompare(b.codigo_proyecto),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Proyecto",
      dataIndex: "descripcion_proyecto",
      key: "descripcion_proyecto",
      sorter: (a, b) =>
        a.descripcion_proyecto.localeCompare(b.descripcion_proyecto),
      render: (text: string) => (
        <Text strong style={{ fontSize: "12px" }}>
          {text?.toUpperCase()}
        </Text>
      ),
    },
    {
      title: "Cant. Documentos",
      key: "cantidad_documentos",
      width: 120,
      align: "center" as const,
      render: (_, record) => (
        <Badge
          count={record.documentacion?.length || 0}
          showZero
          style={{
            backgroundColor:
              record.documentacion?.length > 0 ? "#52c41a" : "#d9d9d9",
          }}
        />
      ),
      sorter: (a, b) =>
        (a.documentacion?.length || 0) - (b.documentacion?.length || 0),
    },
    {
      title: "Etapas",
      key: "etapas",
      width: 150,
      render: (_, record) => {
        if (!record.documentacion || record.documentacion.length === 0) {
          return <Tag color="default">SIN DOCS</Tag>;
        }

        // Obtener etapas únicas
        const etapasUnicas = [
          ...new Set(record.documentacion.map((doc) => doc.etapa)),
        ];

        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {etapasUnicas.slice(0, 2).map((etapa) => (
              <Tag key={etapa} color={getColorEtapa(etapa)}>
                {getTextoEtapa(etapa)}
              </Tag>
            ))}
            {etapasUnicas.length > 2 && <Tag>+{etapasUnicas.length - 2}</Tag>}
          </div>
        );
      },
    },
  ];

  // Expandible row configuration
  const expandableConfig = {
    expandedRowRender: (record: DataType) => renderDocumentosExpandible(record),
    expandIcon: ({ expanded, onExpand, record }: any) =>
      record.documentacion?.length > 0 ? (
        <Button
          type="text"
          icon={<CaretRightOutlined rotate={expanded ? 90 : 0} />}
          onClick={(e) => onExpand(record, e)}
          style={{ marginRight: "8px" }}
        />
      ) : null,
    rowExpandable: (record: DataType) => record.documentacion?.length > 0,
  };

  // Opciones para los filtros
  const filterOptions = [
    {
      key: "etapa",
      label: "Etapa",
      options: getEtapasUnicas(initialData),
      value: etapaFilter,
      onChange: setEtapaFilter,
    },
    {
      key: "rango_documentos",
      label: "Cant. Documentos",
      options: [
        { label: "Sin Documentos", value: "sin_documentos" },
        { label: "Pocos (1-3)", value: "pocos" },
        { label: "Moderados (4-10)", value: "moderados" },
        { label: "Muchos (>10)", value: "muchos" },
      ],
      value: rangoDocumentosFilter,
      onChange: setRangoDocumentosFilter,
    },
  ];

  return (
    <>
      <StyledCard title={"Panel de administración de documentos Celsia"}>
        <SearchBar
          onSearch={handleSearch}
          onReset={handleResetFilters}
          placeholder="Buscar por proyecto, código..."
          filters={filterOptions}
          showFilterButton={false}
        />

        <DataTable
          className="custom-table"
          size="small"
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          scroll={{ x: 1000 }}
          expandable={expandableConfig}
          pagination={{
            total: dataSource?.length,
            showSizeChanger: true,
            defaultPageSize: 30,
            pageSizeOptions: ["5", "10", "20", "30", "50", "100"],
            showTotal: (total: number) => {
              return <Text strong>Total Proyectos: {total}</Text>;
            },
          }}
          style={{ textAlign: "center" }}
          bordered
        />
      </StyledCard>

      <Modal
        title="Documentos Disponibles"
        footer={
          <Button type="primary" onClick={handleOk}>
            OK
          </Button>
        }
        open={isModalOpen}
      >
        {loadingModal ? (
          <Spin />
        ) : datoModal.length === 0 ? (
          <span style={{ color: "red" }}>No hay Documentos Disponibles</span>
        ) : (
          <ul>
            {datoModal.map((item, index) => (
              <li key={index}>{item.actividad}</li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
};
