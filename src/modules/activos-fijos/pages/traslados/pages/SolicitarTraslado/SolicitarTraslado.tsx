import { useEffect, useState } from "react";
import { Button, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getActiSolicitar } from "@/services/activosFijos/TrasladosActivosAPI";
import { SolicitarForm } from "./SolicitarForm";
import { StyledCard } from "@/components/layout/styled";
import { SearchBar } from "@/components/global/SearchBar";
import { DataTable } from "@/components/global/DataTable";

interface DataType {
  key: number;
  id: number;
  numero_activo: string;
  categoria_id: string;
  subcategoria_id: string;
  descripcion: string;
  bodega_actual: string;
  valor: string;
  fecha_fin_garantia: string;
  condicion: string;
  updated_at: string;
  created_at: string;
  marca: string;
  serial: string;
  observacion: string;
  estado: string;
  usuario: string;
  categoria: string;
  solicitud: string;
  subcategoria: string;
}

const { Text } = Typography;

export const SolicitarTraslado = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [condicionFilter, setCondicionFilter] = useState<string>();
  const [categoriaFilter, setCategoriaFilter] = useState<string>();
  const [subcategoriaFilter, setSubcategoriaFilter] = useState<string>();
  const [bodegaFilter, setBodegaFilter] = useState<string>();
  const [solicitudFilter, setSolicitudFilter] = useState<string>();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    setLoading(true);
    getActiSolicitar().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          estado: categoria.estado.toString(),
          numero_activo: categoria.numero_activo,
          valor: categoria.valor,
          condicion: categoria.condicion.toString(),
          usuario: categoria.usuario,
          categoria: categoria.categoria,
          bodega_actual: categoria.bodega_actual,
          solicitud: categoria.solicitud,
          descripcion: categoria.descripcion,
          subcategoria: categoria.subcategoria,
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
          fecha_fin_garantia: dayjs(categoria?.fecha_fin_garantia).format(
            "DD-MM-YYYY HH:mm"
          ),
        };
      });

      setInitialData(categorias);
      setDataSource(categorias);
      setLoadingRow([]);
      setLoading(false);
    });
  };

  // Búsqueda global mejorada
  const handleSearch = (value: string) => {
    if (!value.trim()) {
      applyFilters(); // Aplica los filtros actuales sin búsqueda
      return;
    }

    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  // Aplicar filtros combinados
  const applyFilters = (searchValue?: string) => {
    let filteredData = [...initialData];

    // Aplicar búsqueda global si existe
    if (searchValue && searchValue.trim()) {
      filteredData = filteredData.filter((o: any) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }

    // Filtro por condición
    if (condicionFilter) {
      filteredData = filteredData.filter(item => item.condicion === condicionFilter);
    }

    // Filtro por categoría
    if (categoriaFilter) {
      filteredData = filteredData.filter(item => 
        item.categoria?.toLowerCase().includes(categoriaFilter.toLowerCase())
      );
    }

    // Filtro por subcategoría
    if (subcategoriaFilter) {
      filteredData = filteredData.filter(item => 
        item.subcategoria?.toLowerCase().includes(subcategoriaFilter.toLowerCase())
      );
    }

    // Filtro por bodega
    if (bodegaFilter) {
      filteredData = filteredData.filter(item => 
        item.bodega_actual?.toLowerCase().includes(bodegaFilter.toLowerCase())
      );
    }

    // Filtro por estado de solicitud
    if (solicitudFilter) {
      filteredData = filteredData.filter(item => item.solicitud === solicitudFilter);
    }

    setDataSource(filteredData);
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setCondicionFilter(undefined);
    setCategoriaFilter(undefined);
    setSubcategoriaFilter(undefined);
    setBodegaFilter(undefined);
    setSolicitudFilter(undefined);
    setDataSource(initialData);
  };

  // Aplicar filtros cuando cambien los valores
  useEffect(() => {
    applyFilters();
  }, [condicionFilter, categoriaFilter, subcategoriaFilter, bodegaFilter, solicitudFilter, initialData]);

  // Obtener opciones únicas para filtros
  const getUniqueOptions = (data: DataType[], key: keyof DataType) => {
    const uniqueValues = [...new Set(data.map(item => item[key]))].filter(Boolean);
    return uniqueValues.map(value => ({
      label: String(value).toUpperCase(),
      value: String(value)
    }));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Ubicacion",
      dataIndex: "bodega_actual",
      key: "bodega_actual",
      render: (text) => text?.toUpperCase(),
      fixed: "left",
      sorter: (a, b) => a.bodega_actual.localeCompare(b.bodega_actual),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      render: (text) => text?.toUpperCase(),
      sorter: (a, b) => a.descripcion?.localeCompare(b.descripcion),
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Subcategoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Condición",
      dataIndex: "condicion",
      key: "condicion",
      align: "center",
      render: (_, record: { key: React.Key; condicion: string }) => {
        let estadoString = "";
        let color = "";

        if (record.condicion === "1") {
          estadoString = "BUENO";
          color = "green";
        } else if (record.condicion === "2") {
          estadoString = "REGULAR";
          color = "yellow";
        } else {
          estadoString = "MALO";
          color = "red";
        }

        return (
          <Tag
            color={color}
            key={estadoString}
            icon={
              loadingRow.includes(record.key) ? <SyncOutlined spin /> : null
            }
          >
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.condicion.localeCompare(b.condicion),
    },
    {
      title: "Numero Activo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      align: "center",
      sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
    },
    {
      title: "Estado Solicitud",
      dataIndex: "solicitud",
      key: "solicitud",
      align: "center",
      render: (solicitud: string) => {
        if (solicitud === "1") {
          return <Tag color="orange">SOLICITADO</Tag>;
        }
        return <Tag color="blue">DISPONIBLE</Tag>;
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <SolicitarForm data={record} fetchList={() => fetchCategorias()} />
      ),
      fixed: "right",
      width: 100,
    },
  ];

  // Opciones para los filtros
  const filterOptions = [
    {
      key: "condicion",
      label: "Condición",
      options: [
        { label: "Bueno", value: "1" },
        { label: "Regular", value: "2" },
        { label: "Malo", value: "3" }
      ],
      value: condicionFilter,
      onChange: setCondicionFilter
    },
  ];

  return (
    <StyledCard
      title={"Solicitar Activos"}
      extra={
        <Link to=".." relative="path">
          <Button danger type="primary" icon={<ArrowLeftOutlined />}>
            Volver
          </Button>
        </Link>
      }
    >
      <SearchBar
        onSearch={handleSearch}
        onReset={handleResetFilters}
        placeholder="Buscar activos para solicitar..."
        filters={filterOptions}
        showFilterButton={false}
      />
      
      <DataTable
        className="custom-table"
        rowKey={(record) => record.key}
        size="small"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          total: dataSource?.length,
          showSizeChanger: true,
          defaultPageSize: 15,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => {
            return <Text>Total Registros: {total}</Text>;
          },
        }}
        bordered
        rowClassName={(record) => (record.solicitud === "1" ? "red-row" : "")}
      />
    </StyledCard>
  );
};