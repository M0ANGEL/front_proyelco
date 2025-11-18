import { useEffect, useState, useCallback } from "react";
import { Tag, message, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getActiHistorico } from "@/services/activosFijos/TrasladosActivosAPI";
import { VerFoto } from "../../../crearActivos/pages/ListCrearActivos/VerFoto";
import { GenerarQR } from "../../../crearActivos/pages/ListCrearActivos/GenerarQR";
import { ModalInfo } from "../../../traslados/pages/AceptarTraslados/ModalInfo";
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
  ubicacion_id: string;
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
  subcategoria: string;
  codigo_traslado: string;
  bodega_origen: string;
  bodega_destino: string;
  aceptacion: string;
  usuariosAsignados: string[];
  responsable: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

interface ApiResponse {
  status: string;
  data: DataType[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

// ✅ Utilidad Debounce
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const { Text } = Typography;

export const ListKardex = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  // Estados para filtros
  const [codigoTrasladoFilter, setCodigoTrasladoFilter] = useState<string>();
  const [numeroActivoFilter, setNumeroActivoFilter] = useState<string>();
  const [bodegaDestinoFilter, setBodegaDestinoFilter] = useState<string>();
  const [bodegaOrigenFilter, setBodegaOrigenFilter] = useState<string>();
  const [condicionFilter, setCondicionFilter] = useState<string>();
  const [estadoTrasladoFilter, setEstadoTrasladoFilter] = useState<string>();

  // ✅ Debounce para búsqueda
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchHistorico(1, pagination.pageSize, search);
    }, 500),
    [pagination.pageSize]
  );

  useEffect(() => {
    fetchHistorico(pagination.current, pagination.pageSize, searchText);
  }, []);

  const fetchHistorico = async (
    page: number,
    pageSize: number,
    search: string = ""
  ) => {
    setLoading(true);
    try {
      const { data: response } = (await getActiHistorico({
        page,
        per_page: pageSize,
        search,
      })) as { data: ApiResponse };

      const formattedData = response.data.map((item) => ({
        key: item.id,
        codigo_traslado: item.codigo_traslado,
        activo_id: item.activo_id,
        user_id: item.user_id,
        aceptacion: item.aceptacion,
        bodega_origen: item.bodega_origen,
        bodega_destino: item.bodega_destino,
        usuario: item.usuario,
        categoria: item.categoria,
        subcategoria: item.subcategoria,
        numero_activo: item.numero_activo,
        valor: Number(item.valor).toLocaleString("es-CO"),
        descripcion: item.descripcion,
        condicion: item.condicion.toString(),
        created_at: dayjs(item?.created_at).format("DD-MM-YYYY HH:mm"),
        updated_at: dayjs(item?.updated_at).format("DD-MM-YYYY HH:mm"),
        fecha_fin_garantia: item.fecha_fin_garantia
          ? dayjs(item.fecha_fin_garantia).format("DD-MM-YYYY HH:mm")
          : "",
        usuariosAsignados: item.usuariosAsignados || [],
        responsable: (item.usuariosAsignados || []).join(", "),
      }));

      setDataSource(formattedData);
      setInitialData(formattedData);
      setPagination((prev) => ({
        ...prev,
        current: response.pagination.current_page,
        pageSize: response.pagination.per_page,
        total: response.pagination.total,
      }));
    } catch (error) {
      console.error("Error loading historico:", error);
      message.error("Error al cargar el histórico");
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda global mejorada
  const handleSearch = (value: string) => {
    setSearchText(value);
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

    // Filtro por código de traslado
    if (codigoTrasladoFilter) {
      filteredData = filteredData.filter(item => 
        item.codigo_traslado?.toLowerCase().includes(codigoTrasladoFilter.toLowerCase())
      );
    }

    // Filtro por número de activo
    if (numeroActivoFilter) {
      filteredData = filteredData.filter(item => 
        item.numero_activo?.toLowerCase().includes(numeroActivoFilter.toLowerCase())
      );
    }

    // Filtro por bodega destino
    if (bodegaDestinoFilter) {
      filteredData = filteredData.filter(item => 
        item.bodega_destino?.toLowerCase().includes(bodegaDestinoFilter.toLowerCase())
      );
    }

    // Filtro por bodega origen
    if (bodegaOrigenFilter) {
      filteredData = filteredData.filter(item => 
        item.bodega_origen?.toLowerCase().includes(bodegaOrigenFilter.toLowerCase())
      );
    }

    // Filtro por condición
    if (condicionFilter) {
      filteredData = filteredData.filter(item => item.condicion === condicionFilter);
    }

    // Filtro por estado de traslado
    if (estadoTrasladoFilter) {
      filteredData = filteredData.filter(item => item.aceptacion === estadoTrasladoFilter);
    }

    setDataSource(filteredData);
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setCodigoTrasladoFilter(undefined);
    setNumeroActivoFilter(undefined);
    setBodegaDestinoFilter(undefined);
    setBodegaOrigenFilter(undefined);
    setCondicionFilter(undefined);
    setEstadoTrasladoFilter(undefined);
    setSearchText("");
    setDataSource(initialData);
    fetchHistorico(1, pagination.pageSize, "");
  };

  // Aplicar filtros cuando cambien los valores
  useEffect(() => {
    applyFilters(searchText);
  }, [codigoTrasladoFilter, numeroActivoFilter, bodegaDestinoFilter, bodegaOrigenFilter, condicionFilter, estadoTrasladoFilter, initialData]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 50 } = newPagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchHistorico(current, pageSize, searchText);
  };

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
      title: "Número Activo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      fixed: "left",
      width: 120,
      sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Código Traslado",
      dataIndex: "codigo_traslado",
      key: "codigo_traslado",
      width: 120,
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      width: 120,
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Subcategoría",
      dataIndex: "subcategoria",
      key: "subcategoria",
      width: 120,
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 150,
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Área Origen",
      dataIndex: "bodega_origen",
      key: "bodega_origen",
      width: 120,
      sorter: (a, b) => a.bodega_origen.localeCompare(b.bodega_origen),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Área Destino",
      dataIndex: "bodega_destino",
      key: "bodega_destino",
      width: 120,
      sorter: (a, b) => a.bodega_destino.localeCompare(b.bodega_destino),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Responsable",
      dataIndex: "responsable",
      key: "responsable",
      width: 120,
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Condición",
      dataIndex: "condicion",
      key: "condicion",
      align: "center",
      width: 100,
      render: (_, record) => {
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
            {estadoString}
          </Tag>
        );
      },
      sorter: (a, b) => a.condicion.localeCompare(b.condicion),
    },
    {
      title: "Estado Traslado",
      dataIndex: "aceptacion",
      key: "aceptacion",
      align: "center",
      width: 120,
      render: (aceptacion) => {
        let estadoString;
        let color;

        const acepStr = String(aceptacion);

        if (acepStr === "0") {
          estadoString = "SIN TRASLADAR";
          color = "yellow";
        } else if (acepStr === "1") {
          estadoString = "PENDIENTE";
          color = "red";
        } else if (acepStr === "2") {
          estadoString = "ACEPTADO";
          color = "green";
        } else {
          estadoString = "RECHAZADO";
          color = "red";
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString}
          </Tag>
        );
      },
      sorter: (a, b) => Number(a.aceptacion) - Number(b.aceptacion),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      width: 100,
      sorter: (a, b) => a.valor.localeCompare(b.valor),
      align: "right",
    },
    {
      title: "Fecha Traslado",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <>
          <ModalInfo data={record} />
          <VerFoto id={record.key} />
          <GenerarQR id={record.key} numero_activo={record.numero_activo} />
        </>
      ),
      fixed: "right",
      width: 150,
    },
  ];

  // Opciones para los filtros
  const filterOptions = [
    {
      key: "codigo_traslado",
      label: "Código Traslado",
      options: getUniqueOptions(initialData, 'codigo_traslado'),
      value: codigoTrasladoFilter,
      onChange: setCodigoTrasladoFilter
    },
    {
      key: "numero_activo",
      label: "Número Activo",
      options: getUniqueOptions(initialData, 'numero_activo'),
      value: numeroActivoFilter,
      onChange: setNumeroActivoFilter
    },
    {
      key: "bodega_destino",
      label: "Bodega Destino",
      options: getUniqueOptions(initialData, 'bodega_destino'),
      value: bodegaDestinoFilter,
      onChange: setBodegaDestinoFilter
    },
  ];

  return (
    <StyledCard title={"Histórico de Traslados de Activos"}>
      <SearchBar
        onSearch={handleSearch}
        onReset={handleResetFilters}
        placeholder="Buscar en histórico de traslados..."
        filters={filterOptions}
        showFilterButton={false}
      />

      <DataTable
        className="custom-table"
        rowKey="key"
        size="small"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        scroll={{ x: 1600 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["30", "50", "100"],
          showTotal: (total, range) => (
            <Text strong>
              Mostrando {range[0]}-{range[1]} de {total} registros
            </Text>
          ),
        }}
        onChange={handleTableChange}
        bordered
      />
    </StyledCard>
  );
};