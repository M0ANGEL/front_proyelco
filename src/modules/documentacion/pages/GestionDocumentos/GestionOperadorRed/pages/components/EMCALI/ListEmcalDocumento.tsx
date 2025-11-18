import { useEffect, useState } from "react";
import { Typography, Button, Tag, Row, Col, Badge } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {  getProyectosDocumentacionEmcali } from "@/services/documentacion/documentacionAPI";
import { useNavigate } from "react-router-dom";
import { CaretRightOutlined, FileTextOutlined } from "@ant-design/icons";
import { StyledCard } from "@/components/layout/styled";
import { SearchBar } from "@/components/global/SearchBar";
import { DataTable } from "@/components/global/DataTable";

// Interfaces
interface DocumentacionType {
  codigo_proyecto: string;
  codigo_documento: string;
  etapa: number;
  operador: number;
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

export const ListEmcalDocumento = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [etapaFilter, setEtapaFilter] = useState<string>();
  const [tipoProyectoFilter, setTipoProyectoFilter] = useState<string>();
  const [rangoDocumentosFilter, setRangoDocumentosFilter] = useState<string>();

  // Ejecución
  useEffect(() => {
    fetchTicketsAbiertosGestion();
  }, []);

  const fetchTicketsAbiertosGestion = () => {
    setLoading(true);
    getProyectosDocumentacionEmcali().then(({ data: { data } }) => {
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
          .includes(value.toLowerCase())
      )
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
            .includes(searchValue.toLowerCase())
        )
      );
    }

    // Filtro por etapa
    if (etapaFilter) {
      filteredData = filteredData.filter(item => 
        item.documentacion?.some(doc => doc.etapa.toString() === etapaFilter)
      );
    }

    // Filtro por tipo de proyecto
    if (tipoProyectoFilter) {
      filteredData = filteredData.filter(item => 
        item.tipoProyecto_id?.toLowerCase().includes(tipoProyectoFilter.toLowerCase())
      );
    }

    // Filtro por rango de documentos
    if (rangoDocumentosFilter) {
      const cantidadDocumentos = item => item.documentacion?.length || 0;
      
      switch (rangoDocumentosFilter) {
        case "sin_documentos":
          filteredData = filteredData.filter(item => cantidadDocumentos(item) === 0);
          break;
        case "pocos":
          filteredData = filteredData.filter(item => cantidadDocumentos(item) > 0 && cantidadDocumentos(item) <= 3);
          break;
        case "moderados":
          filteredData = filteredData.filter(item => cantidadDocumentos(item) > 3 && cantidadDocumentos(item) <= 10);
          break;
        case "muchos":
          filteredData = filteredData.filter(item => cantidadDocumentos(item) > 10);
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
    navigate("actividades", {
      state: { 
        codigo_documento: documento
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
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '12px',
                  background: 'white',
                  height: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <FileTextOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  <Text strong style={{ fontSize: "12px" }}>
                    Código: {documento.codigo_documento}
                  </Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color={getColorEtapa(documento.etapa)} style={{ margin: 0 }}>
                    {getTextoEtapa(documento.etapa)}
                  </Tag>
                  
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => verActividades(record, documento)}
                  >
                    Ver Actividades
                  </Button>
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
    const uniqueValues = [...new Set(data.map(item => item[key]))].filter(Boolean);
    return uniqueValues.map(value => ({
      label: String(value).toUpperCase(),
      value: String(value)
    }));
  };

  // Obtener todas las etapas únicas de todos los documentos
  const getEtapasUnicas = (data: DataType[]) => {
    const todasEtapas = data.flatMap(item => 
      item.documentacion?.map(doc => doc.etapa) || []
    );
    const etapasUnicas = [...new Set(todasEtapas)].sort();
    
    return etapasUnicas.map(etapa => ({
      label: getTextoEtapa(etapa),
      value: etapa.toString()
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
      sorter: (a, b) => a.descripcion_proyecto.localeCompare(b.descripcion_proyecto),
      render: (text: string) => (
        <Text strong style={{ fontSize: '12px' }}>
          {text?.toUpperCase()}
        </Text>
      ),
    },
    {
      title: "Cant. Documentos",
      key: "cantidad_documentos",
      width: 120,
      align: 'center' as const,
      render: (_, record) => (
        <Badge 
          count={record.documentacion?.length || 0} 
          showZero 
          style={{ backgroundColor: record.documentacion?.length > 0 ? '#52c41a' : '#d9d9d9' }} 
        />
      ),
      sorter: (a, b) => (a.documentacion?.length || 0) - (b.documentacion?.length || 0),
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
        const etapasUnicas = [...new Set(record.documentacion.map(doc => doc.etapa))];
        
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {etapasUnicas.slice(0, 2).map(etapa => (
              <Tag key={etapa} color={getColorEtapa(etapa)}>
                {getTextoEtapa(etapa)}
              </Tag>
            ))}
            {etapasUnicas.length > 2 && (
              <Tag>+{etapasUnicas.length - 2}</Tag>
            )}
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
          onClick={e => onExpand(record, e)}
          style={{ marginRight: '8px' }}
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
      onChange: setEtapaFilter
    },
    {
      key: "rango_documentos",
      label: "Cant. Documentos",
      options: [
        { label: "Sin Documentos", value: "sin_documentos" },
        { label: "Pocos (1-3)", value: "pocos" },
        { label: "Moderados (4-10)", value: "moderados" },
        { label: "Muchos (>10)", value: "muchos" }
      ],
      value: rangoDocumentosFilter,
      onChange: setRangoDocumentosFilter
    }
  ];

  return (
    <StyledCard title={"Panel de administración de documentos Emcali"}>
      <SearchBar
        onSearch={handleSearch}
        onReset={handleResetFilters}
        placeholder="Buscar por proyecto, código, Proyecto..."
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
          defaultPageSize: 10,
          pageSizeOptions: ["5", "10", "20", "30"],
          showTotal: (total: number) => {
            return (
              <Text strong>
                Total Proyectos: {total}
              </Text>
            );
          },
        }}
        style={{ textAlign: "center" }}
        bordered
      />
    </StyledCard>
  );
};