import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, Typography, Button, Tag } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { getProyectosDocumentacionCelsia } from "@/services/documentacion/documentacionAPI";

// Interfaces
interface DocumentacionType {
  codigo_proyecto: string;
  codigo_documento: string;
  etapa: number;
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

//funcion
export const ListCelsiaDocumento = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //ejecucion
  useEffect(() => {
    fetchTicketsAbiertosGestion();
  }, []);

  const fetchTicketsAbiertosGestion = () => {
    setLoading(true);
    getProyectosDocumentacionCelsia().then(({ data: { data } }) => {
      const tikects = data.map((tikect) => {
        return {
          key: tikect?.id,
          id: tikect?.id,
          descripcion_proyecto: tikect?.descripcion_proyecto,
          codigo_proyecto: tikect?.codigo_proyecto,
          tipoProyecto_id: tikect?.tipoProyecto_id,
          documentacion: tikect?.documentacion || [],
          created_at: dayjs(tikect.created_at).format("DD-MM-YYYY HH:mm"),
        };
      });

      setInitialData(tikects);
      setDataSource(tikects);
      setLoading(false);
    });
  };

  //barra de busqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  // Función para obtener el primer código de documentación
  const getPrimerCodigoDocumento = (documentacion: DocumentacionType[]) => {
    if (!documentacion || documentacion.length === 0) return "-";
    return documentacion[0]?.codigo_documento || "-";
  };

  // Función para obtener el texto de la etapa
  const getTextoEtapa = (documentacion: DocumentacionType[]) => {
    if (!documentacion || documentacion.length === 0) return "-";
    const etapa = documentacion[0]?.etapa?.toString();
    if (!etapa || etapa === "-") return "-";
    return etapa === "1" ? "Principal" : "Secundaria";
  };

  // Función para obtener el color del tag de etapa
  const getColorEtapa = (documentacion: DocumentacionType[]) => {
    if (!documentacion || documentacion.length === 0) return "default";
    const etapa = documentacion[0]?.etapa?.toString();
    if (!etapa || etapa === "-") return "default";
    return etapa === "1" ? "blue" : "green";
  };

  // Navegar a la lista de actividades
  const verActividades = (proyecto: DataType) => {
    // Sin parámetro en la URL, todo va en el state
    navigate("actividades", {
      state: { proyecto },
    });
  };

  //columnas de la tabla con sus datos
  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creacion",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    {
      title: "Código",
      key: "codigo_documento",
      render: (_, record) => getPrimerCodigoDocumento(record.documentacion),
      sorter: (a, b) =>
        getPrimerCodigoDocumento(a.documentacion).localeCompare(
          getPrimerCodigoDocumento(b.documentacion)
        ),
    },
    {
      title: "Proyecto",
      dataIndex: "descripcion_proyecto",
      key: "descripcion_proyecto",
      sorter: (a, b) =>
        a.descripcion_proyecto.localeCompare(b.descripcion_proyecto),
    },
    {
      title: "Etapa",
      key: "etapa",
      render: (_, record) => (
        <Tag color={getColorEtapa(record.documentacion)}>
          {getTextoEtapa(record.documentacion)}
        </Tag>
      ),
      sorter: (a, b) => {
        const etapaA = a.documentacion?.[0]?.etapa?.toString() || "0";
        const etapaB = b.documentacion?.[0]?.etapa?.toString() || "0";
        return etapaA.localeCompare(etapaB);
      },
    },
    {
      title: "Acción",
      align: "center",
      key: "accion",
      render: (_, record: DataType) => (
        <Button
          type="primary"
          size="small"
          onClick={() => verActividades(record)}
        >
          Ver Actividades
        </Button>
      ),
    },
  ];

  return (
    <StyledCard title={"Panel de administración de documentos Emcali"}>
      <SearchBar>
        <Input placeholder="Buscar" onChange={handleSearch} />
      </SearchBar>
      <Table
        className="custom-table"
        size="small"
        dataSource={dataSource ?? initialData}
        columns={columns}
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 30,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => {
            return (
              <>
                <Text>Total Registros: {total}</Text>
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