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
import { getProcesosProyecto } from "@/services/proyectos/proyectosAPI";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import useSessionStorage from "@/hooks/useSessionStorage";
import { DeleteAmCliente } from "@/services/proyectos/procesosProyectoAPI";

// Tipos
interface DataType {
  key: number;
  nombre_tipo: string;
  tipoPoryecto_id: string;
  estado: string;
  nombre_proceso: string;
  id_user: string;
  nombre: string;
  created_at: string;
  updated_at: string;
}

const { Text } = Typography;

export const ListProcesosProyecto = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");
  
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const isAdmin = user_rol === "Administrador";

  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { data } } = await getProcesosProyecto();
      
      const categorias = data.map((categoria) => ({
        key: categoria.id,
        nombre_tipo: categoria.nombre_tipo,
        tipoPoryecto_id: categoria.tipoPoryecto_id,
        estado: "1", // Estado hardcodeado como activo
        nombre_proceso: categoria.nombre_proceso,
        nombre: categoria.nombre,
        id_user: categoria.id_user,
        created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
        updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
      }));

      setInitialData(categorias);
      setFilteredData(categorias);
    } catch (error) {
      console.error("Error fetching procesos:", error);
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los procesos de proyecto",
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
        description: "Estado del proceso actualizado correctamente",
      });
    } catch (error) {
      console.error("Error updating process status:", error);
      notification.error({
        message: "Error",
        description: "No se pudo actualizar el estado del proceso",
      });
    } finally {
      setLoadingRow(prev => prev.filter(rowId => rowId !== id));
    }
  }, [fetchCategorias]);

  const columns = useMemo(() => [
    {
      title: "Proyecto Padre",
      dataIndex: "nombre_tipo",
      key: "nombre_tipo",
      sorter: (a: DataType, b: DataType) => a.nombre_tipo.localeCompare(b.nombre_tipo),
      ellipsis: true,
      width: 180,
    },
    {
      title: "Nombre Proceso",
      dataIndex: "nombre_proceso",
      key: "nombre_proceso",
      render: (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      sorter: (a: DataType, b: DataType) => a.nombre_proceso.localeCompare(b.nombre_proceso),
      ellipsis: true,
      width: 200,
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
      title: "Fecha Creación",
      dataIndex: "created_at",
      key: "created_at",
      align: "center" as const,
      sorter: (a: DataType, b: DataType) => a.created_at.localeCompare(b.created_at),
      width: 140,
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
            title={`¿Desea ${isActive ? "desactivar" : "activar"} este proceso?`}
            onConfirm={() => handleStatus(record.key)}
            placement="left"
            disabled={!isAdmin}
          >
            <Tooltip title={isAdmin ? "Cambiar estado" : "Sin permisos"}>
              <Tag
                color={color}
                icon={loadingRow.includes(record.key) ? <SyncOutlined spin /> : null}
                style={{ 
                  cursor: isAdmin ? "pointer" : "default",
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
          <Tooltip title={isAdmin ? "Editar proceso" : "Sin permisos de edición"}>
            <Link to={`${location.pathname}/edit/${record.key}`}>
              <Button 
                icon={<EditOutlined />} 
                type="primary" 
                size="small"
                disabled={!isAdmin}
              />
            </Link>
          </Tooltip>
        </div>
      ),
      fixed: "right" as const,
      width: 80,
    },
  ], [location.pathname, isAdmin, loadingRow, handleStatus]);

  return (
    <GlobalCard
      title="Gestión de Procesos de Proyecto"
      className="processes-management-container"
      extra={
        <div style={{ display: 'flex', gap: '8px' }}>
          {isAdmin && (
            <Link to={`${location.pathname}/create`}>
              <SaveButton 
                text="Nuevo Proceso" 
                icon={<PlusOutlined />}
              />
            </Link>
          )}
        </div>
      }
    >
      {/* Barra de búsqueda */}
      <div style={{ marginBottom: 16 }}>
        <SearchBar
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="Buscar procesos..."
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
          Total: {filteredData.length} procesos
        </Text>
        {!isAdmin && (
          <Tag color="orange" style={{ margin: 0 }}>
            Modo de solo lectura
          </Tag>
        )}
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {searchValue && `Filtrado por: "${searchValue}"`}
        </Text>
      </div>

      {/* Tabla de procesos */}
      <DataTable
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        withPagination={true}
        hasFixedColumn={false}
        stickyHeader={true}
        scroll={{ x: 800 }}
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
              "No se encontraron procesos que coincidan con la búsqueda" : 
              "No hay procesos de proyecto registrados"
            }
          </Text>
        </div>
      )}
    </GlobalCard>
  );
};

export default ListProcesosProyecto;