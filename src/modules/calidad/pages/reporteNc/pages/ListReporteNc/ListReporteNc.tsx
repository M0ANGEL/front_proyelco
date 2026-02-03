import { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Popconfirm, Tag, Tooltip, Typography, notification } from "antd";
import { Link, useLocation } from "react-router-dom";
import { EditOutlined, SyncOutlined, PlusOutlined } from "@ant-design/icons";

// Componentes globales
import { GlobalCard } from "@/components/global/GlobalCard";
import { DataTable } from "@/components/global/DataTable";
import { SearchBar } from "@/components/global/SearchBar";
import { BackButton } from "@/components/global/BackButton";
import { SaveButton } from "@/components/global/SaveButton";

// Servicios y hooks
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import useSessionStorage from "@/hooks/useSessionStorage";
import { DeleteAmCliente, getAmClientes } from "@/services/clientes/AdministrarClientesApi";

// Tipos
interface DataType {
  key: number;
  emp_nombre: string;
  estado: string;
  nit: number;
  direccion: string;
  telefono: string;
  cuenta_de_correo: string;
  id_user: string;
  nombre: string;
  created_at: string;
  updated_at: string;
}

const { Text } = Typography;

export const ListReporteNc = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");
  
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { data } } = await getAmClientes();
      
      const categorias = data.map((categoria) => ({
        key: categoria.id,
        emp_nombre: categoria.emp_nombre,
        estado: categoria.estado.toString(),
        nit: categoria.nit,
        direccion: categoria.direccion,
        telefono: categoria.telefono,
        cuenta_de_correo: categoria.cuenta_de_correo,
        nombre: categoria.nombre,
        id_user: categoria.id_user,
        created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
        updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
      }));

      setInitialData(categorias);
      setFilteredData(categorias);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los clientes",
      });
    } finally {
      setLoading(false);
      setLoadingRow([]);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setFilteredData(initialData);
      return;
    }

    const filterTable = initialData.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k as keyof DataType]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filterTable);
  }, [initialData]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setFilteredData(initialData);
  }, [initialData]);

  // Cambio de estado
  const handleStatus = useCallback(async (id: React.Key) => {
    setLoadingRow(prev => [...prev, id]);
    try {
      await DeleteAmCliente(id);
      await fetchCategorias();
      notification.success({
        message: "Éxito",
        description: "Estado del cliente actualizado correctamente",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      notification.error({
        message: "Error",
        description: "No se pudo actualizar el estado del cliente",
      });
    } finally {
      setLoadingRow(prev => prev.filter(rowId => rowId !== id));
    }
  }, [fetchCategorias]);

  const columns = useMemo(() => [
    {
      title: "Nombre Empresa",
      dataIndex: "emp_nombre",
      key: "emp_nombre",
      sorter: (a: DataType, b: DataType) => a.emp_nombre.localeCompare(b.emp_nombre),
      ellipsis: true,
      width: 200,
    },
    {
      title: "NIT",
      dataIndex: "nit",
      key: "nit",
      align: "center" as const,
      width: 120,
    },
    {
      title: "Usuario Creó",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a: DataType, b: DataType) => a.nombre.localeCompare(b.nombre),
      ellipsis: true,
      width: 150,
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      align: "center" as const,
      sorter: (a: DataType, b: DataType) => a.telefono.localeCompare(b.telefono),
      width: 120,
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
      sorter: (a: DataType, b: DataType) => a.direccion.localeCompare(b.direccion),
      ellipsis: true,
      width: 200,
    },
    {
      title: "Correo",
      dataIndex: "cuenta_de_correo",
      key: "cuenta_de_correo",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center" as const,
      render: (_: any, record: DataType) => {
        const isActive = record.estado === "1";
        const estadoString = isActive ? "ACTIVO" : "INACTIVO";
        const color = isActive ? "green" : "red";

        return (
          <Popconfirm
            title={`¿Desea ${isActive ? "desactivar" : "activar"} este cliente?`}
            onConfirm={() => handleStatus(record.key)}
            placement="left"
            disabled={!["Administrador"].includes(user_rol)}
          >
            <Tooltip title={["Administrador"].includes(user_rol) ? "Cambiar estado" : "Sin permisos"}>
              <Tag
                color={color}
                icon={loadingRow.includes(record.key) ? <SyncOutlined spin /> : null}
                style={{ 
                  cursor: ["Administrador"].includes(user_rol) ? "pointer" : "default",
                  margin: 0,
                  minWidth: "80px",
                  textAlign: "center"
                }}
              >
                {estadoString}
              </Tag>
            </Tooltip>
          </Popconfirm>
        );
      },
      sorter: (a: DataType, b: DataType) => a.estado.localeCompare(b.estado),
      width: 100,
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center" as const,
      render: (_: any, record: DataType) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Tooltip title="Editar cliente">
            <Link to={`${location.pathname}/edit/${record.key}`}>
              <Button 
                icon={<EditOutlined />} 
                type="primary" 
                size="small"
                disabled={record.estado === "0"}
              />
            </Link>
          </Tooltip>
        </div>
      ),
      fixed: "right" as const,
      width: 80,
    },
  ], [location.pathname, user_rol, loadingRow, handleStatus]);

  return (
    <GlobalCard
      title="Gestión de Clientes"
      className="clients-management-container"
      extra={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`${location.pathname}/create`}>
            <SaveButton 
              text="Nuevo Cliente" 
              icon={<PlusOutlined />}
            />
          </Link>
        </div>
      }
    >
      {/* Barra de búsqueda */}
      <div style={{ marginBottom: 16 }}>
        <SearchBar
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="Buscar clientes..."
          showFilterButton={false}
        />
      </div>

      {/* Información de resultados */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16,
        padding: '12px 16px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <Text strong style={{ color: '#475569' }}>
          Total: {filteredData.length} clientes
        </Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {searchValue && `Filtrado por: "${searchValue}"`}
        </Text>
      </div>

      {/* Tabla de clientes */}
      <DataTable
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        withPagination={true}
        hasFixedColumn={false}
        stickyHeader={true}
        scroll={{ x: 1000 }}
        rowClassName={(record) => 
          record.estado === "1" ? "row-active" : "row-inactive"
        }
      />

      {/* Estado vacío */}
      {filteredData.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#fafafa',
          borderRadius: '8px',
          border: '2px dashed #e2e8f0',
          marginTop: '16px'
        }}>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            {searchValue ? 
              "No se encontraron clientes que coincidan con la búsqueda" : 
              "No hay clientes registrados"
            }
          </Text>
        </div>
      )}
    </GlobalCard>
  );
};

export default ListClientes;