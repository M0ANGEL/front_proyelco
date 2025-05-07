import { useEffect, useState, useMemo } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, Typography, Select, DatePicker, Spin } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getMaMaraciones } from "@/services/marcaciones-asistencias/ma_registroMarcacionesAPI";

interface DataType {
  key: number;
  nombre_usuario: string;
  cedula: string;
  bodega_usuario: string;
  fecha: string;
  bodega_registro: string;
  hora: string;
  tipo_marcacion: string;
}

const { Text } = Typography;
const { Option } = Select;

export const ListRegistroMarcaciones = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    searchText: "",
    bodegaUsuario: null,
    bodegaRegistro: null,
    fecha: null,
  });

  // Obtener datos únicos para los filtros
  const uniqueBodegasRegistro = useMemo(() => 
    [...new Set(initialData.map(item => item.bodega_registro))], 
    [initialData]
  );

  // Cargar datos iniciales
  useEffect(() => {
    fetchRegistrosMarcaciones();
  }, []);

  // Filtrar datos cuando cambian los filtros
  useEffect(() => {
    applyFilters();
  }, [filters, initialData]);

  const fetchRegistrosMarcaciones = async () => {
    try {
      setLoading(true);
      const { data: { data } } = await getMaMaraciones();
      
      const registros = data.map((registro) => ({
        key: registro.id,
        nombre_usuario: registro.nombre_usuario,
        cedula: registro.cedula,
        bodega_usuario: registro.bodega_usuario,
        bodega_registro: registro.bodega_registro,
        tipo_marcacion: registro.tipo_marcacion ? registro.tipo_marcacion : "Antes de la migracion",
        fecha: dayjs(registro?.fecha).format("YYYY-MM-DD"),
        hora: dayjs(registro?.fecha).format("HH:mm"),
      }));

      setInitialData(registros);
      setPagination(prev => ({
        ...prev,
        total: registros.length,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar todos los filtros
  const applyFilters = () => {
    const { searchText, bodegaRegistro, fecha } = filters;
    
    const filtered = initialData.filter((item) => {
      const matchesSearch = !searchText || 
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        );
      
      const matchesBodegaRegistro = !bodegaRegistro || 
        item.bodega_registro === bodegaRegistro;
      
      const matchesFecha = !fecha || 
        item.fecha === fecha;

      return matchesSearch  && 
             matchesBodegaRegistro && matchesFecha;
    });

    setFilteredData(filtered);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: filtered.length,
    }));
  };

  // Manejadores de cambios en los filtros
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchText: e.target.value,
    }));
  };


  const handleBodegaRegistroChange = (value: string | null) => {
    setFilters(prev => ({
      ...prev,
      bodegaRegistro: value,
    }));
  };

  const handleFechaChange = (date: any, dateString: string) => {
    setFilters(prev => ({
      ...prev,
      fecha: dateString || null,
    }));
  };

  // Configuración de columnas
  const columns: ColumnsType<DataType> = [
    {
      title: "Sede donde se registra",
      dataIndex: "bodega_registro",
      key: "bodega_registro",
      sorter: (a, b) => a.bodega_registro.localeCompare(b.bodega_registro),
    },
    {
      title: "Usuario",
      dataIndex: "nombre_usuario",
      key: "nombre_usuario",
      sorter: (a, b) => a.nombre_usuario.localeCompare(b.nombre_usuario),
    },
    {
      title: "Cédula",
      dataIndex: "cedula",
      key: "cedula",
      sorter: (a, b) => a.cedula.localeCompare(b.cedula),
    },
    {
      title: "Sede usuario",
      dataIndex: "bodega_usuario",
      key: "bodega_usuario",
      sorter: (a, b) => a.bodega_usuario.localeCompare(b.bodega_usuario),
    }, 
    {
      title: "Fecha creación",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.fecha.localeCompare(b.fecha),
    },
    {
      title: "Hora",
      dataIndex: "hora",
      key: "hora",
      sorter: (a, b) => a.hora.localeCompare(b.hora),
    },
    {
      title: "Tipo Marcacion",
      dataIndex: "tipo_marcacion",
      key: "tipo_marcacion",
      sorter: (a, b) => a.tipo_marcacion.localeCompare(b.tipo_marcacion),
    },
  ];

  // Datos paginados
  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.current, pagination.pageSize]);

  return (
    <StyledCard title={"Reporte de marcaciones"}>
      <SearchBar>
        <Input 
          placeholder="Buscar" 
          onChange={handleSearch} 
          style={{ width: 250, marginRight: 10 }} 
          allowClear
        />
        <Select
          placeholder="Filtrar por bodega registro"
          onChange={handleBodegaRegistroChange}
          allowClear
          style={{ width: 250, marginRight: 10 }}
          loading={loading}
          value={filters.bodegaRegistro}
        >
          {uniqueBodegasRegistro.map((bodega) => (
            <Option key={bodega} value={bodega}>
              {bodega}
            </Option>
          ))}
        </Select>
        <DatePicker
          placeholder="Filtrar por fecha"
          onChange={handleFechaChange}
          format="YYYY-MM-DD"
          allowClear
          style={{ width: 180 }}
        />
      </SearchBar>
      
      <Spin spinning={loading}>
        <Table
          className="custom-table"
          rowKey={(record) => record.key}
          size="small"
          dataSource={paginatedData}
          columns={columns}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ["5", "15", "20", "50", "100"],
            showTotal: (total) => <Text>Total Registros: {total}</Text>,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize,
              }));
            },
          }}
          bordered
          scroll={{ x: true }}
        />
      </Spin>
    </StyledCard>
  );
};