import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, Typography, Button, Tag, Collapse, Row, Col, Badge } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {  getProyectosDocumentacionEmcali } from "@/services/documentacion/documentacionAPI";
import { useNavigate } from "react-router-dom";
import { CaretRightOutlined, FileTextOutlined } from "@ant-design/icons";

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
const { Panel } = Collapse;

// Función para obtener el texto de la etapa
const getTextoEtapa = (etapa: number) => {
  const etapas: { [key: number]: string } = {
    1: "ET1",
    2: "ET2", 
    3: "ET3",
    // Agrega más etapas según necesites
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
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

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

  // Barra de búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  // Navegar a la lista de actividades
  const verActividades = (proyecto: DataType, documento: DocumentacionType) => {
    navigate("actividades", {
      state: { 
        codigo_documento: documento
      },
    });
  };

  // Manejar expansión de acordeones
  const handlePanelChange = (keys: string | string[]) => {
    setExpandedKeys(Array.isArray(keys) ? keys : [keys]);
  };

  // Renderizar el contenido expandible (acordeón)
  const renderDocumentosExpandible = (record: DataType) => {
    if (!record.documentacion || record.documentacion.length === 0) {
      return <Text type="secondary">No hay documentos</Text>;
    }

    return (
      <Collapse 
        accordion
        activeKey={expandedKeys}
        onChange={handlePanelChange}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{ background: 'transparent' }}
      >
        <Panel 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge 
                count={record.documentacion.length} 
                showZero 
                style={{ backgroundColor: '#1890ff' }} 
              />
              <Text strong>Documentos del Proyecto ({record.documentacion.length})</Text>
            </div>
          } 
          key={record.key}
        >
          <Row gutter={[16, 12]}>
            {record.documentacion.map((documento, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <div 
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '12px',
                    background: '#fafafa'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <FileTextOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                    <Text strong>Código: {documento.codigo_documento}</Text>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tag color={getColorEtapa(documento.etapa)}>
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
        </Panel>
      </Collapse>
    );
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
    },
    {
      title: "Proyecto",
      dataIndex: "descripcion_proyecto",
      key: "descripcion_proyecto",
      sorter: (a, b) => a.descripcion_proyecto.localeCompare(b.descripcion_proyecto),
      render: (text: string) => (
        <Text strong style={{ fontSize: '12px' }}>
          {text}
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
          return <Tag>-</Tag>;
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

  return (
    <StyledCard title={"Panel de administración de documentos Emcali"}>
      <SearchBar>
        <Input 
          placeholder="Buscar por proyecto, código, etapa..." 
          onChange={handleSearch}
          style={{ maxWidth: '100%' }}
          allowClear
        />
      </SearchBar>
      
      <Table
        className="custom-table"
        size="small"
        dataSource={dataSource ?? initialData}
        columns={columns}
        loading={loading}
        scroll={{ x: 800 }}
        expandable={expandableConfig}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: ["5", "10", "20", "30"],
          showTotal: (total: number) => {
            return (
              <>
                <Text>Total Proyectos: {total}</Text>
              </>
            );
          },
        }}
        style={{ textAlign: "center" }}
        bordered
      />
    </StyledCard>
  );
};