import { useEffect, useState } from "react";
import { Typography, Button, Tag, Row, Col, Badge } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getProyectosDocumentacionOrganismos } from "@/services/documentacion/documentacionAPI";
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
  documentos_organismos: DocumentacionType[];
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

// Función para obtener el texto del operador
const getTextoOperador = (operador: number) => {
  const operadores: { [key: number]: string } = {
    1: "RETIE",
    2: "RITEL", 
    3: "RETIALP",
  };
  return operadores[operador] || `Operador ${operador}`;
};

// Función para obtener el color del operador
const getColorOperador = (operador: number) => {
  const colores: { [key: number]: string } = {
    1: "red",
    2: "blue", 
    3: "green",
  };
  return colores[operador] || "default";
};

export const ListOrganismosDocumento = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [etapaFilter, setEtapaFilter] = useState<string>();
  const [operadorFilter, setOperadorFilter] = useState<string>();
  const [tipoProyectoFilter, setTipoProyectoFilter] = useState<string>();
  const [rangoOrganismosFilter, setRangoOrganismosFilter] = useState<string>();

  // Ejecución
  useEffect(() => {
    fetchTicketsAbiertosGestion();
  }, []);

  const fetchTicketsAbiertosGestion = () => {
    setLoading(true);
    getProyectosDocumentacionOrganismos().then(({ data: { data } }) => {
      const proyectos = data.map((proyecto) => {
        return {
          key: proyecto?.id,
          id: proyecto?.id,
          descripcion_proyecto: proyecto?.descripcion_proyecto,
          codigo_proyecto: proyecto?.codigo_proyecto,
          tipoProyecto_id: proyecto?.tipoProyecto_id,
          documentos_organismos: proyecto?.documentos_organismos || [],
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
        item.documentos_organismos?.some(doc => doc.etapa.toString() === etapaFilter)
      );
    }

    // Filtro por operador
    if (operadorFilter) {
      filteredData = filteredData.filter(item => 
        item.documentos_organismos?.some(doc => doc.operador.toString() === operadorFilter)
      );
    }

    // Filtro por tipo de proyecto
    if (tipoProyectoFilter) {
      filteredData = filteredData.filter(item => 
        item.tipoProyecto_id?.toLowerCase().includes(tipoProyectoFilter.toLowerCase())
      );
    }

    // Filtro por rango de organismos
    if (rangoOrganismosFilter) {
      const cantidadOrganismos = item => {
        const organismosUnicos = new Set(item.documentos_organismos?.map(doc => doc.operador) || []);
        return organismosUnicos.size;
      };
      
      switch (rangoOrganismosFilter) {
        case "sin_organismos":
          filteredData = filteredData.filter(item => cantidadOrganismos(item) === 0);
          break;
        case "pocos":
          filteredData = filteredData.filter(item => cantidadOrganismos(item) > 0 && cantidadOrganismos(item) <= 1);
          break;
        case "varios":
          filteredData = filteredData.filter(item => cantidadOrganismos(item) > 1 && cantidadOrganismos(item) <= 2);
          break;
        case "todos":
          filteredData = filteredData.filter(item => cantidadOrganismos(item) > 2);
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
    setOperadorFilter(undefined);
    setTipoProyectoFilter(undefined);
    setRangoOrganismosFilter(undefined);
    setDataSource(initialData);
  };

  // Aplicar filtros cuando cambien los valores
  useEffect(() => {
    applyFilters();
  }, [etapaFilter, operadorFilter, tipoProyectoFilter, rangoOrganismosFilter, initialData]);

  // Navegar a la lista de actividades
  const verActividades = (proyecto: DataType, operador: number, codigoDocumento: string, etapa: number) => {
    navigate("actividades-organismos", {
      state: { 
        codigo_documento: codigoDocumento,
        codigo_proyecto: proyecto.codigo_proyecto,
        etapa: etapa,
        operador: operador,
        nombre_operador: getTextoOperador(operador)
      },
    });
  };

  // Agrupar documentos por organismo
  const agruparDocumentosPorOrganismo = (documentos: DocumentacionType[]) => {
    const gruposPorOrganismo: { [key: number]: DocumentacionType[] } = {};
    
    documentos.forEach(doc => {
      if (!gruposPorOrganismo[doc.operador]) {
        gruposPorOrganismo[doc.operador] = [];
      }
      gruposPorOrganismo[doc.operador].push(doc);
    });
    
    return gruposPorOrganismo;
  };

  // Renderizar el contenido expandible (organismos como tarjetas simples)
  const renderDocumentosExpandible = (record: DataType) => {
    if (!record.documentos_organismos || record.documentos_organismos.length === 0) {
      return (
        <div style={{ padding: "16px", textAlign: "center" }}>
          <Text type="secondary">No hay documentos para este proyecto</Text>
        </div>
      );
    }

    const documentosPorOrganismo = agruparDocumentosPorOrganismo(record.documentos_organismos);

    return (
      <div style={{ padding: "16px", background: "#fafafa" }}>
        <div style={{ marginBottom: "16px" }}>
          <Text strong style={{ fontSize: "14px" }}>
            Organismos de Inspección ({Object.keys(documentosPorOrganismo).length})
          </Text>
        </div>
        
        <Row gutter={[16, 12]}>
          {Object.entries(documentosPorOrganismo).map(([operador, documentos]) => {
            const operadorNum = parseInt(operador);
            const documentosUnicos = new Set(documentos.map(doc => doc.codigo_documento));
            const etapasUnicas = [...new Set(documentos.map(doc => doc.etapa))];
            
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={operador}>
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
                    <FileTextOutlined style={{ 
                      color: getColorOperador(operadorNum), 
                      marginRight: '8px' 
                    }} />
                    <Text strong style={{ fontSize: "12px" }}>
                      {getTextoOperador(operadorNum)}
                    </Text>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <Tag color={getColorOperador(operadorNum)} style={{ margin: 0, fontSize: '10px' }}>
                        {documentosUnicos.size} doc(s)
                      </Tag>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {etapasUnicas.slice(0, 2).map(etapa => (
                        <Tag 
                          key={etapa} 
                          color={getColorEtapa(etapa)}
                          style={{ margin: 0, fontSize: '10px' }}
                        >
                          {getTextoEtapa(etapa)}
                        </Tag>
                      ))}
                      {etapasUnicas.length > 2 && (
                        <Tag style={{ fontSize: '10px', margin: 0 }}>
                          +{etapasUnicas.length - 2}
                        </Tag>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: "10px" }}>
                      {Array.from(documentosUnicos).slice(0, 2).join(', ')}
                      {documentosUnicos.size > 2 && '...'}
                    </Text>
                    
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => {
                        const primerDocumento = documentos[0];
                        verActividades(record, operadorNum, primerDocumento.codigo_documento, primerDocumento.etapa);
                      }}
                    >
                      Ver Actividades
                    </Button>
                  </div>
                </div>
              </Col>
            );
          })}
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
      item.documentos_organismos?.map(doc => doc.etapa) || []
    );
    const etapasUnicas = [...new Set(todasEtapas)].sort();
    
    return etapasUnicas.map(etapa => ({
      label: getTextoEtapa(etapa),
      value: etapa.toString()
    }));
  };

  // Obtener todos los operadores únicos
  const getOperadoresUnicos = (data: DataType[]) => {
    const todosOperadores = data.flatMap(item => 
      item.documentos_organismos?.map(doc => doc.operador) || []
    );
    const operadoresUnicos = [...new Set(todosOperadores)].sort();
    
    return operadoresUnicos.map(operador => ({
      label: getTextoOperador(operador),
      value: operador.toString()
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
      title: "Cant. Organismos",
      key: "cantidad_organismos",
      width: 120,
      align: 'center' as const,
      render: (_, record) => {
        const organismosUnicos = new Set(record.documentos_organismos?.map(doc => doc.operador) || []);
        return (
          <Badge 
            count={organismosUnicos.size} 
            showZero 
            style={{ 
              backgroundColor: organismosUnicos.size > 0 ? '#52c41a' : '#d9d9d9',
            }} 
          />
        );
      },
      sorter: (a, b) => {
        const orgsA = new Set(a.documentos_organismos?.map(doc => doc.operador) || []);
        const orgsB = new Set(b.documentos_organismos?.map(doc => doc.operador) || []);
        return orgsA.size - orgsB.size;
      },
    },
    {
      title: "Organismos",
      key: "organismos",
      width: 150,
      render: (_, record) => {
        if (!record.documentos_organismos || record.documentos_organismos.length === 0) {
          return <Tag color="default">SIN ORGANISMOS</Tag>;
        }
        
        const organismosUnicos = [...new Set(record.documentos_organismos.map(doc => doc.operador))];
        
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {organismosUnicos.slice(0, 2).map(operador => (
              <Tag key={operador} color={getColorOperador(operador)} style={{ fontSize: '10px' }}>
                {getTextoOperador(operador)}
              </Tag>
            ))}
            {organismosUnicos.length > 2 && (
              <Tag style={{ fontSize: '10px' }}>+{organismosUnicos.length - 2}</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Etapas",
      key: "etapas",
      width: 120,
      render: (_, record) => {
        if (!record.documentos_organismos || record.documentos_organismos.length === 0) {
          return <Tag color="default">SIN ETAPAS</Tag>;
        }
        
        const etapasUnicas = [...new Set(record.documentos_organismos.map(doc => doc.etapa))];
        
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {etapasUnicas.slice(0, 2).map(etapa => (
              <Tag key={etapa} color={getColorEtapa(etapa)} style={{ fontSize: '10px' }}>
                {getTextoEtapa(etapa)}
              </Tag>
            ))}
            {etapasUnicas.length > 2 && (
              <Tag style={{ fontSize: '10px' }}>+{etapasUnicas.length - 2}</Tag>
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
      record.documentos_organismos?.length > 0 ? (
        <Button
          type="text"
          icon={<CaretRightOutlined rotate={expanded ? 90 : 0} />}
          onClick={e => onExpand(record, e)}
          style={{ marginRight: '8px' }}
        />
      ) : null,
    rowExpandable: (record: DataType) => record.documentos_organismos?.length > 0,
  };

  // Opciones para los filtros
  const filterOptions = [
    {
      key: "operador",
      label: "Organismo",
      options: getOperadoresUnicos(initialData),
      value: operadorFilter,
      onChange: setOperadorFilter
    },
    {
      key: "etapa",
      label: "Etapa",
      options: getEtapasUnicas(initialData),
      value: etapaFilter,
      onChange: setEtapaFilter
    },
    {
      key: "rango_organismos",
      label: "Cant. Organismos",
      options: [
        { label: "Sin Organismos", value: "sin_organismos" },
        { label: "Pocos (1)", value: "pocos" },
        { label: "Varios (2)", value: "varios" },
        { label: "Todos (3+)", value: "todos" }
      ],
      value: rangoOrganismosFilter,
      onChange: setRangoOrganismosFilter
    }
  ];

  return (
    <StyledCard title={"Panel de administración de documentos de Organismos"}>
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